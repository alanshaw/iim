import { default as info } from './info.js'
import { default as link } from './link.js'
import { default as list } from './list.js'
import { default as help } from './help.js'
import { default as use } from './use.js'
import { default as version } from './version.js'

export interface ParseArgsOptionConfig {
  type: 'string' | 'boolean'
  multiple?: boolean
  short?: string
  default?: string | boolean | string[] | boolean[]
}

export interface Command {
  aliases: string[],
  help: string
  options: Record<string, ParseArgsOptionConfig>
  run: (positionals: string[], options: any) => Promise<void> | void
}

const commands: Record<string, Command> = {
  help,
  info,
  link,
  list,
  use,
  version
}

// set up aliases
for (const command of Object.values(commands)) {
  command.aliases.forEach(alias => {
    commands[alias] = command
  })
}

export default commands
