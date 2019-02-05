#!/usr/bin/env node

const IIM = require('./commands')
const argv = require('minimist')(process.argv.slice(2))
const log = require('debug')('iim:bin')
const explain = require('explain-error')

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
