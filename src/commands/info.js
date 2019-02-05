const ora = require('ora')
const info = require('../lib/info')
const { binPath, installPath } = require('../default-paths')

module.exports = async () => {
  const spinner = ora()
  const {
    implName,
    version,
    ipfsPath,
    implBinPath
  } = await info({ spinner }, binPath, installPath)

  console.log(`⚡️ version: ${implName} ${version}`)
  console.log(`📦 repo path: ${ipfsPath}`)
  console.log(`🏃‍♂️ bin path: ${implBinPath}`)
}

module.exports.help = `
iim info - Get info about the IPFS implementation currently in use.

Usage:
  iim info [options...]

Options:
  --help, -h  Get help for the info command.

Alias:
  i
`
