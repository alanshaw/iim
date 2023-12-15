import Fs from 'node:fs/promises'
import Os from 'node:os'
import Path from 'node:path'
import Url from 'node:url'
// @ts-expect-error no types
import explain from 'explain-error'
import { readPackageUp } from 'read-package-up'
import type { Context } from '../bin.js'

export interface Info {
  implName: string
  version: string
  ipfsPath: string
  implBinPath: string
}

export default async (ctx: Context, binLinkPath: string, installPath: string): Promise<Info> => {
  const { spinner } = ctx

  spinner.start('fetching current version info')
  let binPath
  try {
    binPath = await Fs.readlink(binLinkPath)
  } catch (err) {
    spinner.fail()
    throw explain(err, 'failed to read IPFS symlink')
  }
  spinner.succeed()
  spinner.stop()

  if (!binPath.startsWith(installPath)) {
    throw new Error('unmanaged IPFS install')
  }

  const [implName, version] = binPath
    .replace(installPath, '')
    .split(Path.sep)[1]
    .split('@')

  const result = await readPackageUp({ cwd: Path.dirname(Url.fileURLToPath(import.meta.url)) })

  if (result == null) {
    throw new Error('Could not read package.json')
  }

  const ipfsPath = Path.join(Os.homedir(), `.${result.packageJson.name}`, `${implName}@${version}`)

  return { implName, version, ipfsPath, implBinPath: binPath }
}
