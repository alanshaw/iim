const Fs = require('fs')
const { promisify } = require('util')
const symlink = require('./use/symlink')

module.exports = async (ctx, currentBinLinkPath, binPath) => {
  const { spinner } = ctx
  const libBinPath = await promisify(Fs.readlink)(currentBinLinkPath)
  await symlink({ spinner }, libBinPath, binPath)
}
