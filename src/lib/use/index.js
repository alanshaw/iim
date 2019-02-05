const Path = require('path')
const explain = require('explain-error')
const Chalk = require('chalk')
const selectVersion = require('./select-version')
const npmInstall = require('./npm-install')
const writeLibBin = require('./write-lib-bin')
const symlink = require('./symlink')
const ipfsInit = require('./ipfs-init')
const configureNode = require('./configure-node')
const Implementations = require('../../implementations.json')

const ImplsConf = {
  js: {
    moduleName: Implementations.js.moduleName,
    binPath: Path.join('node_modules', '.bin', 'jsipfs'),
    configure: true,
    update: true
  },
  go: {
    moduleName: Implementations.go.moduleName,
    binPath: Path.join('node_modules', 'go-ipfs-dep', 'go-ipfs', 'ipfs'),
    configure: false,
    update: false
  }
}

module.exports = async function use (
  ctx,
  implName,
  versionRange,
  binPath,
  installPath,
  homePath,
  currentBinLinkPath
) {
  const { spinner, npm } = ctx

  if (!implName) {
    throw new Error('missing implementation name')
  }

  if (!Object.keys(ImplsConf).includes(implName)) {
    throw new Error(`unknown implementation ${implName}`)
  }

  // Select the version we want to use based on the input range
  const version = await selectVersion(
    { npm, spinner },
    ImplsConf[implName].moduleName,
    versionRange,
    { moduleTitle: `${implName}-ipfs` }
  )

  const implInstallPath = Path.join(installPath, `${implName}-ipfs@${version}`)
  const isInstalled = await npmInstall(
    { npm, spinner },
    ImplsConf[implName].moduleName,
    version,
    implInstallPath,
    { update: ImplsConf[implName].update, moduleTitle: `${implName}-ipfs` }
  )

  // /usr/local/bin/ipfs
  // -> ~/.iim/dists/js-ipfs@0.34.4/ipfs
  // -> ~/.iim/dists/js-ipfs@0.34.4/node_modules/.bin/jsipfs
  const libBinPath = Path.join(implInstallPath, 'ipfs')
  const implBinPath = Path.join(implInstallPath, ImplsConf[implName].binPath)
  const ipfsPath = Path.join(homePath, `${implName}-ipfs@${version}`)

  await writeLibBin({ spinner }, libBinPath, implBinPath, ipfsPath)

  // If the version wasn't already installed we need to ipfs init
  if (!isInstalled) {
    await ipfsInit({ spinner }, libBinPath, ipfsPath)

    if (ImplsConf[implName].configure) {
      await configureNode({ spinner }, libBinPath)
    }
  }

  // Make a note of which bin is current
  // ~/.iim/dists/current
  // -> ~/.iim/dists/js-ipfs@0.34.4/ipfs
  await symlink({ spinner }, libBinPath, currentBinLinkPath)

  try {
    await symlink({ spinner }, libBinPath, binPath)
  } catch (err) {
    throw explain(err, `failed to link binary at ${binPath}, try running ${Chalk.bold('sudo iim link')}`)
  }

  spinner.info(`using repo at ${ipfsPath}`)

  spinner.stop()
}
