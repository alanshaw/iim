const Fs = require('fs')
const { promisify } = require('util')

module.exports = async function symlink (ctx, from, to) {
  const { spinner } = ctx

  spinner.start(`symlinking ${from} -> ${to}`)
  try {
    await promisify(Fs.unlink)(to)
  } catch (err) {
    // Ignore if not exists...
    if (err.code !== 'ENOENT') {
      spinner.fail(`failed to remove existing file ${to}`)
      throw err
    }
  }

  try {
    await promisify(Fs.symlink)(from, to)
  } catch (err) {
    spinner.fail(`failed to symlink ${from} -> ${to}`)
    throw err
  }
  spinner.succeed(`symlinked ${from} -> ${to}`)
}
