import ora from 'ora'
import Npm from '../lib/npm/index.js'
import use from '../lib/use/index.js'
import { binPath, installPath, homePath, currentBinLinkPath } from '../default-paths.js'
import type { ParseArgsOptionConfig } from './index.js'

const help = `
iim use - Install and use an IPFS implementation.

Usage:
  iim use <impl> [version] [options...]

Arguments:
  impl        The implementation to use, current supports "js" or "go".
  version     A valid semver version for the selected implementation.

Options:
  --pre,  -p  Include pre-release versions.
  --help, -h  Get help for the use command.

Alias:
  u
`

const options: Record<string, ParseArgsOptionConfig> = {
  pre: {
    short: 'p',
    type: 'boolean'
  }
}

export default {
  aliases: ['u'],
  help,
  options,
  run: async (positionals: string[], options: { pre: boolean }) => {
    const [implName, versionRange] = positionals

    const spinner = ora()
    const npm = new Npm()
    await use({ npm, spinner }, implName, versionRange, options.pre, binPath, installPath, homePath, currentBinLinkPath)

    console.log('🚀 IPFS is ready to use')
  }
}
