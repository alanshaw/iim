#!/usr/bin/env node

import { parseArgs } from 'node:util'
import commands from './commands/index.js'
import type { Ora } from 'ora'
import type NpmLib from './lib/npm/index.js'
// import debug from 'debug'
// import explain from 'explain-error'

// const log = debug('iim:bin')

export interface Context {
  spinner: Ora
  npm?: NpmLib
}

const rootArgv = parseArgs({ args: process.argv, allowPositionals: true, strict: false })

const subcommand = commands[rootArgv.positionals[2]]

if (subcommand == null) {
  commands.help.run(rootArgv.positionals.slice(3), rootArgv.values)
  process.exit(0)
}

const subcommandArgv = parseArgs({ args: process.argv, options: subcommand.options, allowPositionals: true, strict: true })

subcommand.run(subcommandArgv.positionals.slice(3), subcommandArgv.values)

/*
let cmd = argv._[0]

const logError = err => {
  console.error(`💥 ${err.message}`)
  log(err)
}

process.on('uncaughtException', err => logError(err))
process.on('unhandledRejection', err => { logError(err); process.exit(1) })

if (!cmd && (argv.v || argv.version)) {
  cmd = 'version'
}

if (argv.h || argv.help || argv.usage) {
  cmd = 'help'
}

if (!IIM[cmd]) {
  throw new Error(`unknown command "${cmd}"`)
}

let cmdArgs
try {
  cmdArgs = IIM[cmd].parseArgs ? IIM[cmd].parseArgs(process.argv.slice(2)) : []
} catch (err) {
  throw explain(err, 'failed to parse args')
}

IIM[cmd](...cmdArgs)
*/