const spawn = require('../../lib/spawn')

module.exports = async function configureNode (ctx, binPath) {
  const { spinner } = ctx

  spinner.start('configuring IPFS')
  try {
    await spawn(binPath, ['config', 'Addresses.API', '/ip4/127.0.0.1/tcp/5001'])
    await spawn(binPath, ['config', 'Addresses.Gateway', '/ip4/127.0.0.1/tcp/8080'])
    await spawn(binPath, ['config', 'Addresses.Swarm', JSON.stringify([
      '/ip4/0.0.0.0/tcp/4001',
      '/ip6/::/tcp/4001',
      '/ip4/127.0.0.1/tcp/4003/ws'
    ]), '--json'])
  } catch (err) {
    spinner.fail(`failed to init IPFS`)
    throw err
  }
  spinner.succeed('configured IPFS')
}
