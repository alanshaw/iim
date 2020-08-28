const ora = require('ora')
const parseArgs = require('minimist')
const Npm = require('../lib/npm')
const use = require('../lib/use')
const { binPath, installPath, homePath, currentBinLinkPath } = require('../default-paths')

module.exports = async (implName, versionRange, includePre) => {
  const spinner = ora()
  const npm = new Npm()
  await use({ npm, spinner }, implName, versionRange, includePre, binPath, installPath, homePath, currentBinLinkPath)

  console.log('🚀 IPFS is ready to use')
}

module.exports.parseArgs = args => {
  const argv = parseArgs(args)

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

  let includePre = false
  if (argv.pre || argv.p) {
    includePre = true
  }

  return [impl, version, includePre]
}

module.exports.help = `
iim use - Install and use an IPFS implementation.

Usage:
  iim use <impl> [version] [options...]

Arguments:
  impl        The implementation to use, current supports "js" or "go".
  version     A valid semver version for the selected implementation.

Options:
  --pre,  -p  Include prerelease versions.
  --help, -h  Get help for the use command.

Alias:
  u
`
