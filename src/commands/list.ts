/* eslint-disable no-console */
import Chalk from 'chalk'
import ora from 'ora'
import { binPath, installPath } from '../default-paths.js'
import list from '../lib/list.js'
import Npm from '../lib/npm/index.js'
import type { ParseArgsOptionConfig } from './index.js'

const help = `
iim list - List the installed IPFS versions.

Usage:
  iim list [impl] [options...]

Arguments:
  impl        Filter the list by implementation name ("js" or "go").

Options:
  --remote, -r   Include remote versions
  --deprecated, -d   Include deprecated remote versions
  --help, -h  Get help for the list command.

Alias:
  ls
`

const options: Record<string, ParseArgsOptionConfig> = {
  deprecated: {
    type: 'boolean',
    short: 'd'
  },
  all: {
    type: 'boolean',
    short: 'a'
  }
}

export default {
  aliases: ['ls'],
  help,
  options,
  run: async (positionals: string[], options: any) => {
    const spinner = ora()
    const npm = new Npm()
    const versions = await list({ spinner, npm }, installPath, binPath, {
      implName: positionals[0],
      ...options
    })

    if (versions.length === 0) {
      console.log('😱 no IPFS versions installed yet'); return
    }

    versions.forEach(({ implName, version, current, local }) => {
      let line = `${implName} ${version}`
      if (current != null) {
        line = `* ${Chalk.green(line)}`
      } else if (local == null) {
        line = `  ${Chalk.red(line)}`
      } else {
        line = `  ${line}`
      }
      console.log(line)
    })
  }
}
