const Npm = require('../../lib/npm')
const Path = require('path')
const Os = require('os')
const ora = require('ora')
const selectVersion = require('./select-version')
const npmInstall = require('./npm-install')
const writeLibBin = require('./write-lib-bin')
const symlink = require('./symlink')
const ipfsInit = require('./ipfs-init')
const configureNode = require('./configure-node')
const pkg = require('../../../package.json')
const { libInstallPath, binPath } = require('../../lib/paths')

const Impls = {
  js: {
    moduleName: 'ipfs',
    binPath: Path.join('node_modules', '.bin', 'jsipfs'),
    configure: true,
    update: true
  },
  go: {
    moduleName: 'go-ipfs-dep',
    binPath: Path.join('node_modules', 'go-ipfs-dep', 'go-ipfs', 'ipfs'),
    configure: false,
    update: false
  }
}

module.exports = async function use (implName, versionRange, options) {
  options = options || {}

  if (!implName) {
    throw new Error('missing implementation name')
  }

  if (!Object.keys(Impls).includes(implName)) {
    throw new Error(`unknown implementation ${implName}`)
  }

  // Wait for experimental fs.promises warning to get out the way
  // TODO: remove when promises api is unexperimentalised
  await new Promise(resolve => setTimeout(resolve))

  const spinner = ora()
  const npm = new Npm()

  // Select the version we want to use based on the input range
  const version = await selectVersion(
    { npm, spinner },
    Impls[implName].moduleName,
    versionRange,
    { moduleTitle: `${implName}-ipfs` }
  )

  const implInstallPath = Path.join(libInstallPath, `${implName}-ipfs@${version}`)
  const isInstalled = await npmInstall(
    { npm, spinner },
    Impls[implName].moduleName,
    version,
    implInstallPath,
    { update: Impls[implName].update, moduleTitle: `${implName}-ipfs` }
  )

  // /usr/local/bin/ipfs -> /usr/local/lib/iim/ipfs -> /usr/local/lib/iim/js-ipfs@0.34.4/node_modules/.bin/jsipfs
  const libBinPath = Path.join(implInstallPath, 'ipfs')
  const implBinPath = Path.join(implInstallPath, Impls[implName].binPath)
  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${implName}-ipfs@${version}`)

  await writeLibBin({ spinner }, libBinPath, implBinPath, ipfsPath)
  await symlink({ spinner }, libBinPath, binPath)

  // If the version wasn't already installed we need to ipfs init
  if (!isInstalled) {
    await ipfsInit({ spinner }, binPath, ipfsPath)

    if (Impls[implName].configure) {
      await configureNode({ spinner }, binPath)
    }
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
