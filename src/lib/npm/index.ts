import Path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'url'
import debug from 'debug'
import { execa } from 'execa'
// @ts-expect-error no types
import Npm from 'npm'
import Semver from 'semver'

const dirname = Path.dirname(fileURLToPath(import.meta.url))

const log = debug('iim:lib:npm')

export interface GetVersionsOptions {
  deprecated?: boolean
}

export default class NpmLib {
  private _npm?: Npm.Static

  async _getNpm (): Promise<Npm.Static> {
    if (this._npm != null) {
      return this._npm
    }

    this._npm = await promisify(Npm.load)({ loglevel: 'silent', progress: false })

    return this._npm
  }

  async getVersions (mod: string, options?: GetVersionsOptions): Promise<string[]> {
    log(`npm view ${mod} time`)

    const req = await fetch(`https://registry.npmjs.org/${mod}`)
    const body = await req.json()

    const versions: string[] = []
    const registryVersions: Array<[string, any]> = Object.entries(body.versions)

    for (const [version, metadata] of registryVersions) {
      if (Semver.valid(version) == null) {
        continue
      }

      if (metadata.deprecated != null && options?.deprecated !== true) {
        continue
      }

      versions.push(version)
    }

    return versions
  }

  async rangeToVersion (mod: string, range: string, includePre: boolean, includeDeprecated: boolean): Promise<string> {
    const allVers = await this.getVersions(mod, {
      deprecated: includeDeprecated
    })

    if (allVers.length === 0) {
      throw new Error(`${mod} has no versions to select from. Some may be deprecated, pass --deprecated as a flag to enabled their use`)
    }

    let rangeVers = includePre
      ? allVers
      : allVers.filter(v => Semver.prerelease(v) == null)

    if (range != null) {
      // If the user provides 1 or 1.2, we want to range-ify it to ^1 or ^1.2
      const parts = range.split('.')
      if (parts.length < 3 && parts.every(p => /^[0-9]+$/.test(p))) {
        range = `^${range}`
      }

      if (Semver.validRange(range, true) == null) {
        throw new Error(`invalid version or range "${range}"`)
      }

      log('range', range)

      // Filter to versions in the given range
      rangeVers = allVers.filter(v => Semver.satisfies(v, range, true))
    }

    log('versions', allVers.join(', '))

    if (rangeVers.length === 0) {
      throw new Error('no versions found within range')
    }

    // Get the top most ranking version available
    return rangeVers.reduce((top, v) => Semver.gt(v, top) ? v : top, rangeVers[0])
  }

  async install (mod: string, version: string, path: string): Promise<void> {
    await execa('node', [Path.join(dirname, 'bin', 'install'), `${mod}@${version}`], { cwd: path })
  }

  async update (path: string): Promise<void> {
    await execa('node', [Path.join(dirname, 'bin', 'update')], { cwd: path })
  }
}
