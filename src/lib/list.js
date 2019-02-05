const Fs = require('fs').promises
const explain = require('explain-error')
const Semver = require('semver')
const log = require('debug')('iim:lib:list')
const info = require('./info')
const Implementations = require('../implementations.json')

module.exports = async (ctx, installPath, binLinkPath, options) => {
  const { spinner, npm } = ctx
  options = options || {}

  if (options.implName && Implementations[options.implName] == null) {
    throw new Error(`unknown implementation ${options.implName}`)
  }

  let currentVersionInfo
  try {
    currentVersionInfo = await info(ctx, binLinkPath, installPath)
  } catch (err) {
    log(err) // Not fatal, continue
  }

  spinner.start('fetching local versions')
  let files
  try {
    files = await Fs.readdir(installPath)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      spinner.fail()
      throw explain(err, 'failed to read local versions')
    }
    files = []
  }
  spinner.succeed()

  const byImplName = ({ implName }) => (
    options.implName ? implName.startsWith(options.implName) : true
  )

  const localVersions = files
    .filter(f => f.includes('@'))
    .map(f => {
      const [ implName, version ] = f.split('@')
      return { implName, version, local: true }
    })
    .filter(byImplName)

  log('local', localVersions)

  if (!options.all) {
    return flagCurrent(currentVersionInfo, localVersions.sort(sortImplNameVersion))
  }

  const remoteModules = Object.entries(Implementations)
    .map(entry => ({ implName: entry[0] + '-ipfs', moduleName: entry[1].moduleName }))
    .filter(byImplName)

  for (let i = 0; i < remoteModules.length; i++) {
    spinner.start(`fetching remote ${remoteModules[i].implName} versions`)
    try {
      remoteModules[i].versions = await npm.getVersions(remoteModules[i].moduleName)
    } catch (err) {
      spinner.fail()
      throw explain(err, `failed to get ${remoteModules[i].implName} versions`)
    }
    spinner.succeed()
  }

  const remoteVersions = remoteModules
    .reduce((versions, remoteModule) => {
      const moduleVersions = remoteModule.versions.map(v => ({
        implName: remoteModule.implName,
        version: v
      }))
      return versions.concat(moduleVersions)
    }, [])
    .filter((remoteVersion) => {
      return !localVersions.some(localVersion => {
        return localVersion.implName === remoteVersion.implName &&
          localVersion.version === remoteVersion.version
      })
    })

  log('remote', remoteVersions)

  return flagCurrent(currentVersionInfo, localVersions.concat(remoteVersions).sort(sortImplNameVersion))
}

function sortImplNameVersion (a, b) {
  if (a.implName === b.implName) {
    if (a.version === b.version) return 0
    return Semver.gt(a.version, b.version) ? -1 : 1
  } else {
    return a.implName.localeCompare(b.implName)
  }
}

function flagCurrent (currentVersionInfo, versions) {
  if (!currentVersionInfo) return versions
  return versions.map(v => {
    if (v.implName === currentVersionInfo.implName &&
      v.version === currentVersionInfo.version) {
      v.current = true
    }
    return v
  })
}
