/* eslint-disable no-console */
import Path from 'node:path'
import Url from 'node:url'
import { readPackageUp } from 'read-package-up'

export default {
  aliases: [],
  help: '',
  options: {},
  run: async () => {
    const result = await readPackageUp({ cwd: Path.dirname(Url.fileURLToPath(import.meta.url)) })
    console.info(result?.packageJson.version)
  }
}
