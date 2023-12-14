import Chalk from 'chalk'
import type { Context } from '../../bin'

export interface SelectVersionOptions {
  includePre: boolean
  moduleTitle: string
}

export default async function selectVersion (ctx: Required<Context>, mod: string, version: string, options: SelectVersionOptions): Promise<string> {
  const { spinner, npm } = ctx
  options = options || {}

  spinner.start(`finding ${options.moduleTitle} versions`)
  try {
    version = await npm.rangeToVersion(mod, version, options.includePre)
  } catch (err) {
    spinner.fail(`failed to find ${options.moduleTitle} versions`)
    throw err
  }
  spinner.succeed(`selected ${Chalk.bold(options.moduleTitle)} version ${Chalk.bold(version)}`)

  return version
}
