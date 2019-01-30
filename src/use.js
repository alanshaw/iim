const Npm = require('./lib/npm')
const Path = require('path')
const Fs = require('fs').promises
const ora = require('ora')
const explain = require('explain-error')
const pkg = require('../package.json')
const spawn = require('./lib/spawn')

const ImplModule = {
  js: 'ipfs',
  go: 'go-ipfs-dep'
}

const ImplBin = {
  js: Path.join('node_modules', '.bin', 'jsipfs'),
  go: Path.join('node_modules', 'go-ipfs-dep', 'go-ipfs', 'ipfs')
}

// TODO: windows?
const libInstallPath = `/usr/local/lib/${pkg.name}`

module.exports = async function use (implName, versionRange, options) {
  options = options || {}

  if (!implName) {
    throw new Error('missing implementation name')
  }

  if (!Object.keys(ImplModule).includes(implName)) {
    throw new Error(`unknown implementation ${implName}`)
  }

  // Wait for experimental fs.promises warning to get out the way
  // TODO: remove when promises api is unexperimentalised
  await new Promise(resolve => setTimeout(resolve))

  const spinner = ora()
  const npm = new Npm()

  // Select the version we want to use based on the input range
  const version = await selectVersion({ npm, spinner }, implName, versionRange)

  const implInstallPath = Path.join(libInstallPath, `${implName}-ipfs@${version}`)
  const isInstalled = await install({ npm, spinner }, implName, version, implInstallPath)

  // /usr/local/bin/ipfs -> /usr/local/lib/iim/ipfs -> /usr/local/lib/iim/js-ipfs@0.34.4/node_modules/.bin/jsipfs
  // TODO: what is the bin path on windows?
  const binPath = '/usr/local/bin/ipfs'
  const libBinPath = Path.join(implInstallPath, 'ipfs')
  const implBinPath = Path.join(implInstallPath, ImplBin[implName])

  const ipfsPath = Path.join(`.${pkg.name}`, `${implName}-ipfs@${version}`)

  await writeLibBin({ spinner }, libBinPath, implBinPath, ipfsPath)
  await symlink({ spinner }, libBinPath, binPath)

  // If the version wasn't already installed we need to ipfs init
  if (!isInstalled) {
    await ipfsInit({ spinner }, binPath)
  }

  spinner.stopAndPersist({ symbol: '🚀', text: 'IPFS is ready to use' })
}

module.exports.parseArgs = argv => {
  let impl = argv._[1]
  let version = argv._[2]

  if (impl && impl.includes('@')) {
    const parts = impl.split('@')
    impl = parts[0]
    version = parts[1]
  }

  // minimist will coerce 0.34 into a number
  if (version) {
    version = version.toString()
  }

  return [impl, version]
}

async function selectVersion (ctx, impl, version) {
  const { spinner, npm } = ctx

  spinner.start(`finding ${impl}-ipfs versions`)
  try {
    version = await npm.rangeToVersion(ImplModule[impl], version)
  } catch (err) {
    spinner.fail(`failed to find ${impl}-ipfs versions`)
    throw err
  }
  spinner.succeed(`selected ${impl}-ipfs version ${version}`)

  return version
}

async function install (ctx, impl, version, path) {
  const { spinner, npm } = ctx

  spinner.start(`checking to see if ${impl}-ipfs@${version} is already installed`)
  let isInstalled = false
  try {
    await Fs.stat(Path.join(path, 'node_modules', ImplModule[impl]))
    isInstalled = true
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw explain(err, `failed to determine if ${impl}-ipfs ${version} is already installed`)
    }
    await Fs.mkdir(path, { recursive: true })
  }

  spinner.text = `${isInstalled ? 'updating' : 'installing'} ${impl}-ipfs ${version}`

  try {
    if (isInstalled) {
      await npm.update(path)
    } else {
      await npm.install(ImplModule[impl], version, path)
    }
  } catch (err) {
    spinner.fail(`failed to ${isInstalled ? 'update' : 'install'} ${impl}-ipfs ${version}`)
    throw err
  }
  spinner.succeed(`${isInstalled ? 'updated' : 'installed'} ${impl}-ipfs ${version}`)

  return isInstalled
}

async function symlink (ctx, from, to) {
  const { spinner } = ctx

  spinner.start(`symlinking ${from} -> ${to}`)
  try {
    await Fs.unlink(to)
  } catch (err) {
    spinner.fail(`failed to remove existing file ${to}`)
    throw err
  }

  try {
    await Fs.symlink(from, to)
  } catch (err) {
    spinner.fail(`failed to symlink ${from} -> ${to}`)
    throw err
  }
  spinner.succeed(`symlinked ${from} -> ${to}`)
}

async function writeLibBin (ctx, destPath, ipfsBinPath, ipfsPath) {
  const { spinner } = ctx
  const binTplPath = Path.join(__dirname, 'bin', 'ipfs.tpl.js')

  spinner.start(`installing IPFS binary at ${destPath}`)
  try {
    let content = await Fs.readFile(binTplPath, 'utf8')
    content = content.replace('{{IPFS_PATH}}', ipfsPath)
    content = content.replace('{{IPFS_BIN_PATH}}', ipfsBinPath)
    await Fs.writeFile(destPath, content, { mode: 0o755 })
  } catch (err) {
    spinner.fail(`failed to install IPFS binary at ${destPath}`)
    throw err
  }
  spinner.succeed(`installed IPFS binary at ${destPath}`)
}

async function ipfsInit (ctx, binPath) {
  const { spinner } = ctx

  spinner.start(`initializing IPFS`)
  try {
    await spawn(binPath, ['init'])
  } catch (err) {
    spinner.fail(`failed to init IPFS`)
    throw err
  }
  spinner.succeed(`initialized IPFS`)
}
