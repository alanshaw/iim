import ora from 'ora'
import Chalk from 'chalk'
import Npm from '../lib/npm/index.js'
import list from '../lib/list.js'
import { binPath, installPath } from '../default-paths.js'
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

    if (!versions.length) {
      return console.log('😱 no IPFS versions installed yet')
    }

    versions.forEach(({ implName, version, current, local }) => {
      let line = `${implName} ${version}`
      if (current) {
        line = `* ${Chalk.green(line)}`
      } else if (!local) {
        line = `  ${Chalk.red(line)}`
      } else {
        line = `  ${line}`
      }
      console.log(line)
    })
  }
}
