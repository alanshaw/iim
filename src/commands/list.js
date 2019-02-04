const ora = require('ora')
const list = require('../lib/list')
const { installPath } = require('../lib/paths')

module.exports = async () => {
  const spinner = ora()
  const versions = await list({ spinner }, installPath)

  if (!versions.length) {
    return console.log('😱 no versions installed yet')
  }

  versions.forEach(({ moduleName, version }) => console.log(`${moduleName} ${version}`))
}
