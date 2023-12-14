import { execa } from 'execa'
import type { Context } from '../../bin.js'

export default async function configureNode (ctx: Context, binPath: string): Promise<void> {
  const { spinner } = ctx

  spinner.start('configuring IPFS')
  try {
    await execa(binPath, ['config', 'Addresses.API', '/ip4/127.0.0.1/tcp/5001'])
    await execa(binPath, ['config', 'Addresses.Gateway', '/ip4/127.0.0.1/tcp/8080'])
    await execa(binPath, ['config', 'Addresses.Swarm', JSON.stringify([
      '/ip4/0.0.0.0/tcp/4001',
      '/ip6/::/tcp/4001',
      '/ip4/127.0.0.1/tcp/4003/ws'
    ]), '--json'])
  } catch (err) {
    spinner.fail()
    throw err
  }
  spinner.succeed('configured IPFS')
}
