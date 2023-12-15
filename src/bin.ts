#!/usr/bin/env node
/* eslint-disable no-console */

import { parseArgs } from 'node:util'
import debug from 'debug'
import commands, { type ParseArgsOptionConfig } from './commands/index.js'
import type NpmLib from './lib/npm/index.js'
import type { Ora } from 'ora'

const log = debug('iim:bin')

export interface Context {
  spinner: Ora
  npm?: NpmLib
}

const options: Record<string, ParseArgsOptionConfig> = {
  help: {
    type: 'boolean',
    short: 'h'
  }
}

const rootArgv = parseArgs({ args: process.argv, options, allowPositionals: true, strict: false })

const subcommand = commands[rootArgv.positionals[2]]

if (subcommand == null) {
  await commands.help.run(rootArgv.positionals.slice(3), rootArgv.values)
  process.exit(0)
}

if (rootArgv.values.help === true) {
  console.info(subcommand.help)
  process.exit(0)
}

const subcommandArgv = parseArgs({ args: process.argv, options: subcommand.options, allowPositionals: true, strict: true })

await subcommand.run(subcommandArgv.positionals.slice(3), subcommandArgv.values)

const logError = (err: Error): void => {
  console.error(`💥 ${err.message}`)
  log(err)
}

process.on('uncaughtException', (err: Error): void => {
  logError(err)
})
process.on('unhandledRejection', (err: Error): void => {
  logError(err)
  process.exit(1)
})
