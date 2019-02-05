const Path = require('path')
const Fs = require('fs')
const Os = require('os')
const { promisify } = require('util')

module.exports = async function writeLibBin (ctx, destPath, ipfsBinPath, ipfsPath) {
  const { spinner } = ctx
  const binTplPath = Path.join(__dirname, '..', '..', 'bin', 'ipfs.tpl.js')

  ipfsPath = ipfsPath.replace(Os.homedir() + Path.sep, '')

  spinner.start(`installing binary at ${destPath}`)
  try {
    let content = await promisify(Fs.readFile)(binTplPath, 'utf8')
    content = content.replace('{{IPFS_PATH}}', ipfsPath)
    content = content.replace('{{IPFS_BIN_PATH}}', ipfsBinPath)
    await promisify(Fs.writeFile)(destPath, content, { mode: 0o755 })
  } catch (err) {
    spinner.fail(`failed to install binary at ${destPath}`)
    throw err
  }
  spinner.succeed(`installed binary at ${destPath}`)
}
