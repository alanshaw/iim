import Path from 'node:path'
import Os from 'node:os'
import { readPackageUp } from 'read-package-up'

const result = await readPackageUp()

if (result == null) {
  throw new Error('Could not read package.json')
}

export const homePath = Path.join(Os.homedir(), `.${result.packageJson.name}`)
export const installPath = Path.join(homePath, 'dists')

// TODO: windows?
// TODO: what is the bin path on windows?
export const binPath = '/usr/local/bin/ipfs'

export const currentBinLinkPath = Path.join(installPath, 'current')
