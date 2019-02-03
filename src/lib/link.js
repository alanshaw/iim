const Fs = require('fs').promises
const symlink = require('./use/symlink')

module.exports = async (ctx, currentBinLinkPath, binPath) => {
  const { spinner } = ctx
  const libBinPath = await Fs.readlink(currentBinLinkPath)
  await symlink({ spinner }, libBinPath, binPath)
}
