const ora = require('ora')
const Npm = require('../lib/npm')
const use = require('../lib/use')
const { binPath, installPath, homePath, currentBinLinkPath } = require('../lib/paths')

module.exports = async (implName, versionRange) => {
  const spinner = ora()
  const npm = new Npm()
  await use({ npm, spinner }, implName, versionRange, binPath, installPath, homePath, currentBinLinkPath)

  console.log('🚀 IPFS is ready to use')
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
