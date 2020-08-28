const Fs = require('fs')
const Path = require('path')
const Os = require('os')
const { promisify } = require('util')
const explain = require('explain-error')
const pkg = require('../../package.json')

module.exports = async (ctx, binLinkPath, installPath) => {
  const { spinner } = ctx

  spinner.start('fetching current version info')
  let binPath
  try {
    binPath = await promisify(Fs.readlink)(binLinkPath)
  } catch (err) {
    spinner.fail()
    throw explain(err, 'failed to read IPFS symlink')
  }
  spinner.succeed()
  spinner.stop()

  if (!binPath.startsWith(installPath)) {
    throw new Error('unmanaged IPFS install')
  }

  const [implName, version] = binPath
    .replace(installPath, '')
    .split(Path.sep)[1]
    .split('@')

  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${implName}@${version}`)

  return { implName, version, ipfsPath, implBinPath: binPath }
}
