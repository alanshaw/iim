import Path from 'node:path'
import Fs from 'node:fs/promises'
import Os from 'node:os'
import type { Context } from '../../bin'
import { dirname } from 'node:path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default async function writeLibBin (ctx: Context, destPath: string, ipfsBinPath: string, ipfsPath: string): Promise<void> {
  const { spinner } = ctx
  const binTplPath = Path.join(__dirname, '..', '..', 'bin', 'ipfs.tpl.js')

  ipfsPath = ipfsPath.replace(Os.homedir() + Path.sep, '')

  spinner.start(`installing binary at ${destPath}`)
  try {
    let content = await Fs.readFile(binTplPath, 'utf8')
    content = content.replace('{{IPFS_PATH}}', ipfsPath)
    content = content.replace('{{IPFS_BIN_PATH}}', ipfsBinPath)
    await Fs.writeFile(destPath, content, { mode: 0o755 })
  } catch (err) {
    spinner.fail(`failed to install binary at ${destPath}`)
    throw err
  }
  spinner.succeed(`installed binary at ${destPath}`)
}
