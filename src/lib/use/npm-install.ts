import Fs from 'node:fs/promises'
import Path from 'node:path'
// @ts-expect-error no types
import explain from 'explain-error'
import type { Context } from '../../bin.js'
import { execa } from 'execa'

export interface TargetVersion {
  update: boolean
}

export default async function npmInstall (ctx: Required<Context>, moduleName: string, version: string, path: string, options: TargetVersion): Promise<boolean> {
  const { spinner, npm } = ctx
  options = options ?? {}

  spinner.start(`checking to see if ${moduleName}@${version} is already installed`)
  let isInstalled = false
  try {
    await Fs.stat(Path.join(path, 'node_modules', moduleName.replaceAll('@', '/')))
    isInstalled = true
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      spinner.fail()
      throw explain(err, `failed to determine if ${moduleName} ${version} is already installed`)
    }
    await Fs.mkdir(path, { recursive: true })
  }

  if (isInstalled && !options.update) {
    return isInstalled
  }

  spinner.text = `${isInstalled ? 'updating' : 'installing'} ${moduleName} ${version}`

  try {
    if (isInstalled) {
      await npm.update(path)
    } else {
      await npm.install(moduleName, version, path)

      // run postinstall if necessary
      const installDir = Path.join(path, 'node_modules', moduleName.replaceAll('@', '/'))

      const manifest = JSON.parse(await Fs.readFile(Path.join(installDir, 'package.json'), {
        encoding: 'utf-8'
      }))

      if (manifest.scripts.postinstall != null) {
        await execa('npm', ['run', 'postinstall'], {
          cwd: installDir
        })
      }
    }
  } catch (err) {
    spinner.fail(`failed to ${isInstalled ? 'update' : 'install'} ${moduleName} ${version}`)
    throw err
  }
  spinner.succeed(`${isInstalled ? 'updated' : 'installed'} ${moduleName} ${version}`)

  return isInstalled
}
