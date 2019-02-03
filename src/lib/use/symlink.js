const Fs = require('fs').promises

module.exports = async function symlink (ctx, from, to) {
  const { spinner } = ctx

  spinner.start(`symlinking ${from} -> ${to}`)
  try {
    await Fs.unlink(to)
  } catch (err) {
    spinner.fail(`failed to remove existing file ${to}`)
    throw err
  }

  try {
    await Fs.symlink(from, to)
  } catch (err) {
    spinner.fail(`failed to symlink ${from} -> ${to}`)
    throw err
  }
  spinner.succeed(`symlinked ${from} -> ${to}`)
}
