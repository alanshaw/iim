const ora = require('ora')
const link = require('../lib/link')
const { binPath, currentBinLinkPath } = require('../lib/paths')

module.exports = async () => {
  const spinner = ora()
  await link({ spinner }, currentBinLinkPath, binPath)
  console.log(`🔗 IPFS linked`)
}

module.exports.help = `
iim link - Symlink the current install as /usr/local/bin/ipfs.

If you accidentally remove or write over the symlink at /usr/local/bin/ipfs \`iim link\` will restore it, pointing it at the current IPFS binary.

It's also useful in the case where a user does not have sufficient privileges to write to /usr/local/bin because it allows IPFS to be installed with a non-privileged account and then symlinked with \`sudo iim link\` afterwards.

Usage:
  iim link

Options:
  --help, -h  Get help for the link command.
`
