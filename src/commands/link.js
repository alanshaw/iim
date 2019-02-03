const ora = require('ora')
const link = require('../lib/link')
const { binPath, currentBinLinkPath } = require('../lib/paths')

module.exports = async () => {
  const spinner = ora()
  await link({ spinner }, currentBinLinkPath, binPath)
  console.log(`🔗 IPFS linked`)
}
