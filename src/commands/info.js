const ora = require('ora')
const info = require('../lib/info')
const { binPath, installPath } = require('../lib/paths')

module.exports = async () => {
  const spinner = ora()
  const {
    moduleName,
    version,
    ipfsPath,
    implBinPath
  } = await info({ spinner }, binPath, installPath)

  console.log(`⚡️ version: ${moduleName} ${version}`)
  console.log(`📦 repo path: ${ipfsPath}`)
  console.log(`🏃‍♂️ bin path: ${implBinPath}`)
}
