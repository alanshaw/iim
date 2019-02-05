const ora = require('ora')
const Npm = require('../lib/npm')
const list = require('../lib/list')
const Chalk = require('chalk')
const { binPath, installPath } = require('../lib/paths')

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

module.exports.parseArgs = argv => {
  return [{ implName: argv._[1], all: argv.a || argv.all }]
}
