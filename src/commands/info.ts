import ora from 'ora'
import info from '../lib/info.js'
import { binPath, installPath } from '../default-paths.js'

const help = `
iim info - Get info about the IPFS implementation currently in use.

Usage:
  iim info [options...]

Options:
  --help, -h  Get help for the info command.

Alias:
  i
`

const options = {}

export default {
  aliases: ['i'],
  help,
  options,
  run: async () => {
    const spinner = ora()
    const {
      implName,
      version,
      ipfsPath,
      implBinPath
    } = await info({ spinner }, binPath, installPath)

    console.log(`⚡️ version: ${implName} ${version}`)
    console.log(`📦 repo path: ${ipfsPath}`)
    console.log(`🏃‍♂️ bin path: ${implBinPath}`)
  }
}
