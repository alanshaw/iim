const Npm = require('npm')
const { promisify } = require('util')
const Semver = require('semver')
const log = require('debug')('iim:lib:npm')
const Path = require('path')
const spawn = require('../spawn')

module.exports = class NpmLib {
  constructor () {
    this._npm = null
  }

  async _getNpm () {
    if (this._npm) return this._npm
    this._npm = await promisify(Npm.load)({ loglevel: 'silent', progress: false })
    return this._npm
  }

  async getVersions (mod) {
    const npm = await this._getNpm()
    log(`npm view ${mod} time`)
    const res = await promisify(npm.commands.view)([mod, 'time'], true)
    const currentVer = Object.keys(res)[0]
    return Object.keys(res[currentVer].time).filter(v => Semver.valid(v))
  }

  async rangeToVersion (mod, range) {
    const allVers = await this.getVersions(mod)

    if (!allVers.length) {
      throw new Error(`${mod} has no versions to select from`)
    }

    let rangeVers = allVers

    if (range) {
      // If the user provides 1 or 1.2, we want to range-ify it to ^1 or ^1.2
      const parts = range.split('.')
      if (parts.length < 3 && parts.every(p => /^[0-9]+$/.test(p))) {
        range = `^${range}`
      }

      if (!Semver.validRange(range, true)) {
        throw new Error(`invalid version or range "${range}"`)
      }

      log('range', range)

      // Filter to versions in the given range
      rangeVers = allVers.filter(v => Semver.satisfies(v, range, true))
    }

    log('versions', allVers.join(', '))

    if (!rangeVers.length) {
      throw new Error('no versions found within range')
    }

    // Get the top most ranking version available
    return rangeVers.reduce((top, v) => Semver.gt(v, top) ? v : top, rangeVers[0])
  }

  async install (mod, version, path) {
    await spawn('node', [Path.join(__dirname, 'bin', 'install'), `${mod}@${version}`], { cwd: path })
  }

  async update (path) {
    await spawn('node', [Path.join(__dirname, 'bin', 'update')], { cwd: path })
  }
}
