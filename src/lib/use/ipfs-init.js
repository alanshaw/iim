const spawn = require('../spawn')

module.exports = async function ipfsInit (ctx, binPath, ipfsPath) {
  const { spinner } = ctx

  spinner.start(`initializing IPFS at ${ipfsPath}`)
  try {
    await spawn(binPath, ['init'])
  } catch (err) {
    spinner.fail('failed to init IPFS')
    throw err
  }
  spinner.succeed(`initialized IPFS at ${ipfsPath}`)
}
