import Fs from 'node:fs/promises'
import debug from 'debug'
// @ts-expect-error no types
import explain from 'explain-error'
import Semver from 'semver'
import { implementations } from '../implementations.js'
import info, { type Info } from './info.js'
import type { Context } from '../bin.js'

const log = debug('iim:lib:list')

export interface Version {
  implName: string
  version: string
  current?: boolean
  local?: boolean
}

interface RemoteVersion {
  implName: string
  moduleName: string
  versions: string[]
}

export interface ListOptions {
  all?: boolean
  deprecated?: boolean
  implName?: string
}

export default async (ctx: Required<Context>, installPath: string, binLinkPath: string, options: ListOptions = {}): Promise<Version[]> => {
  const { spinner, npm } = ctx

  if (options?.implName != null && implementations[options.implName] == null) {
    throw new Error(`unknown implementation ${options.implName}`)
  }

  let currentVersionInfo: Info | undefined
  try {
    currentVersionInfo = await info(ctx, binLinkPath, installPath)
  } catch (err) {
    log(err) // Not fatal, continue
  }

  spinner.start('fetching local versions')
  let files: string[]
  try {
    files = await Fs.readdir(installPath)
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      spinner.fail()
      throw explain(err, 'failed to read local versions')
    }
    files = []
  }
  spinner.succeed()

  const byImplName = ({ implName }: { implName: string }): boolean => (
    options?.implName != null ? implName.startsWith(options.implName) : true
  )

  const localVersions: Version[] = files
    .filter(f => f.includes('@'))
    .map(f => {
      const [implName, version] = f.split('@')
      return { implName, version, local: true }
    })
    .filter(byImplName)

  log('local', localVersions)

  if (options.all == null) {
    return flagCurrent(currentVersionInfo, localVersions.sort(sortImplNameVersion))
  }

  const remoteModules: RemoteVersion[] = Object.entries(implementations)
    .map(entry => ({ implName: entry[1].moduleName, moduleName: entry[1].moduleName, versions: [] }))
    .filter(byImplName)

  for (let i = 0; i < remoteModules.length; i++) {
    spinner.start(`fetching remote ${remoteModules[i].implName} versions`)
    try {
      remoteModules[i].versions = await npm.getVersions(remoteModules[i].moduleName, {
        deprecated: options.deprecated
      })
    } catch (err) {
      spinner.fail()
      throw explain(err, `failed to get ${remoteModules[i].implName} versions`)
    }
    spinner.succeed()
  }

  const remoteVersions = remoteModules
    .reduce<any[]>((versions, remoteModule) => {
    const moduleVersions = remoteModule.versions
      .map(v => ({
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

function sortImplNameVersion (a: Version, b: Version): number {
  if (a.implName === b.implName) {
    if (a.version === b.version) return 0
    return Semver.gt(a.version, b.version) ? -1 : 1
  } else {
    return a.implName.localeCompare(b.implName)
  }
}

function flagCurrent (currentVersionInfo: Info | undefined, versions: Version[]): Version[] {
  if (currentVersionInfo == null) {
    return versions
  }

  return versions.map(v => {
    if (v.implName === currentVersionInfo.implName &&
      v.version === currentVersionInfo.version) {
      v.current = true
    }
    return v
  })
}
