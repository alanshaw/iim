import Fs from 'node:fs/promises'
import symlink from './use/symlink.js'
import type { Context } from '../bin.js'

export default async (ctx: Context, currentBinLinkPath: string, binPath: string): Promise<void> => {
  const { spinner } = ctx
  const libBinPath = await Fs.readlink(currentBinLinkPath)
  await symlink({ spinner }, libBinPath, binPath)
}
