#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const IIM = require('./')
const argv = require('minimist')(process.argv.slice(2))
const log = require('debug')('iim:bin')
const explain = require('explain-error')

const cmd = argv._[0]

const logError = err => {
  console.error(`💥 ${err.message}`)
  log(err)
}

process.on('uncaughtException', err => logError(err))
process.on('unhandledRejection', err => { logError(err); process.exit(1) })

if (cmd === 'version' || argv.v || argv.version) {
  console.log(require('../package.json').version)
  process.exit()
}

if (!cmd || argv.h || argv.help || argv.usage) {
  console.log(Fs.readFileSync(Path.join(__dirname, 'help', `${cmd || 'index'}.txt`), 'utf8'))
  process.exit()
}

if (!IIM[cmd]) {
  throw new Error(`unknown command "${cmd}"`)
}

let cmdArgs
try {
  cmdArgs = IIM[cmd].parseArgs ? IIM[cmd].parseArgs(argv) : []
} catch (err) {
  throw explain(err, 'failed to parse args')
}

IIM[cmd](...cmdArgs)
