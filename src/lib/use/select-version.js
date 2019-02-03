module.exports = async function selectVersion (ctx, mod, version, options) {
  const { spinner, npm } = ctx
  options = options || {}

  spinner.start(`finding ${options.moduleTitle} versions`)
  try {
    version = await npm.rangeToVersion(mod, version)
  } catch (err) {
    spinner.fail(`failed to find ${options.moduleTitle} versions`)
    throw err
  }
  spinner.succeed(`selected ${options.moduleTitle} version ${version}`)

  return version
}
