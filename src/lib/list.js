const Fs = require('fs').promises
const explain = require('explain-error')

module.exports = async (ctx, installPath) => {
  const { spinner } = ctx

  spinner.start('fetching installed versions')
  let files
  try {
    files = await Fs.readdir(installPath)
  } catch (err) {
    spinner.fail()
    throw explain(err, 'failed to read IPFS symlink')
  }
  spinner.succeed()
  spinner.stop()

  return files
    .filter(f => f.includes('@'))
    .map(f => {
      const [ moduleName, version ] = f.split('@')
      return { moduleName, version }
    })
}
