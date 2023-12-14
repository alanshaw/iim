import Fs from 'node:fs/promises'
import type { Context } from '../../bin.js'

export default async function symlink (ctx: Context, from: string, to: string): Promise<void> {
  const { spinner } = ctx

  spinner.start(`symlinking ${from} -> ${to}`)
  try {
    await Fs.unlink(to)
  } catch (err: any) {
    // Ignore if not exists...
    if (err.code !== 'ENOENT') {
      spinner.fail(`failed to remove existing file ${to}`)
      throw err
    }
  }

  try {
    await Fs.symlink(from, to)
  } catch (err) {
    spinner.fail(`failed to symlink ${from} -> ${to}`)
    throw err
  }
  spinner.succeed(`symlinked ${from} -> ${to}`)
}
