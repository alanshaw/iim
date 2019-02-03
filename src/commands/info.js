const Fs = require('fs').promises
const Path = require('path')
const Os = require('os')
const ora = require('ora')
const explain = require('explain-error')
const pkg = require('../../package.json')
const { binPath, libInstallPath } = require('../lib/paths')

module.exports = async () => {
  const spinner = ora()

  spinner.start('fetching info')
  let linkPath
  try {
    linkPath = await Fs.readlink(binPath)
  } catch (err) {
    throw explain(err, 'failed to read IPFS symlink')
  }
  spinner.succeed()
  spinner.stop()

  if (!linkPath.startsWith(libInstallPath)) {
    throw new Error('unmanaged IPFS install')
  }

  const [ mod, version ] = linkPath
    .replace(libInstallPath, '')
    .split(Path.sep)[1]
    .split('@')

  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${mod}@${version}`)
  const implBinPath = Path.join(libInstallPath, `${mod}@${version}`, 'ipfs')

  console.log(`⚡️ version: ${mod} ${version}`)
  console.log(`📦 repo path: ${ipfsPath}`)
  console.log(`🏃‍♂️ bin path: ${implBinPath}`)
}
