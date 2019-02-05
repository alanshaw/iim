#!/usr/bin/env node

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

const needsHelp = Boolean(argv.h || argv.help || argv.usage)

if (needsHelp) {
  setTimeout(() => {
    if (cmd && IIM[cmd].help) {
      console.log(IIM[cmd].help)
    } else {
      IIM.help()
    }
  })
} else {
  if (!IIM[cmd]) {
    throw new Error(`unknown command "${cmd}"`)
  }

  let cmdArgs
  try {
    cmdArgs = IIM[cmd].parseArgs ? IIM[cmd].parseArgs(argv) : []
  } catch (err) {
    throw explain(err, 'failed to parse args')
  }

  // Wait for experimental fs.promises warning to get out the way
  // TODO: remove when promises api is unexperimentalised
  setTimeout(() => IIM[cmd](...cmdArgs))
}
