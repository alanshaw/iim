const ora = require('ora')
const Chalk = require('chalk')
const parseArgs = require('minimist')
const Npm = require('../lib/npm')
const list = require('../lib/list')
const { binPath, installPath } = require('../default-paths')

module.exports = async options => {
  const spinner = ora()
  const npm = new Npm()
  const versions = await list({ spinner, npm }, installPath, binPath, options)

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

module.exports.parseArgs = args => {
  const argv = parseArgs(args, { boolean: ['a', 'all'] })
  return [{ implName: argv._[1], all: argv.a || argv.all }]
}

module.exports.help = `
iim list - List the installed IPFS versions.

Usage:
  iim list [impl] [options...]

Arguments:
  impl        Filter the list by implementation name ("js" or "go").

Options:
  --all, -a   List all available versions both local and remote.
  --help, -h  Get help for the list command.

Alias:
  ls
`
