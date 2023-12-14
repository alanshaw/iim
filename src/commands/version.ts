/* eslint-disable no-console */
import { readPackageUp } from 'read-package-up'

export default {
  aliases: [],
  help: '',
  options: {},
  run: async () => {
    const result = await readPackageUp()
    console.info(result?.packageJson.version)
  }
}
