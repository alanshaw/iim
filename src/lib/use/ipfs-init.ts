import { execa } from 'execa'
import type { Context } from '../../bin.js'

export default async function ipfsInit (ctx: Context, binPath: string, ipfsPath: string): Promise<void> {
  const { spinner } = ctx

  spinner.start(`initializing IPFS at ${ipfsPath}`)
  try {
    await execa(binPath, ['init'])
  } catch (err) {
    spinner.fail('failed to init IPFS')
    throw err
  }
  spinner.succeed(`initialized IPFS at ${ipfsPath}`)
}
