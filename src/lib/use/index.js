const Path = require('path')
const selectVersion = require('./select-version')
const npmInstall = require('./npm-install')
const writeLibBin = require('./write-lib-bin')
const symlink = require('./symlink')
const ipfsInit = require('./ipfs-init')
const configureNode = require('./configure-node')

const Impls = {
  js: {
    moduleName: 'ipfs',
    binPath: Path.join('node_modules', '.bin', 'jsipfs'),
    configure: true,
    update: true
  },
  go: {
    moduleName: 'go-ipfs-dep',
    binPath: Path.join('node_modules', 'go-ipfs-dep', 'go-ipfs', 'ipfs'),
    configure: false,
    update: false
  }
}

module.exports = async function use (ctx, implName, versionRange, binPath, installPath, homePath) {
  const { spinner, npm } = ctx

  if (!implName) {
    throw new Error('missing implementation name')
  }

  if (!Object.keys(Impls).includes(implName)) {
    throw new Error(`unknown implementation ${implName}`)
  }

  // Select the version we want to use based on the input range
  const version = await selectVersion(
    { npm, spinner },
    Impls[implName].moduleName,
    versionRange,
    { moduleTitle: `${implName}-ipfs` }
  )

  const implInstallPath = Path.join(installPath, `${implName}-ipfs@${version}`)
  const isInstalled = await npmInstall(
    { npm, spinner },
    Impls[implName].moduleName,
    version,
    implInstallPath,
    { update: Impls[implName].update, moduleTitle: `${implName}-ipfs` }
  )

  // /usr/local/bin/ipfs
  // -> /usr/local/lib/iim/ipfs
  // -> /usr/local/lib/iim/js-ipfs@0.34.4/node_modules/.bin/jsipfs
  const libBinPath = Path.join(implInstallPath, 'ipfs')
  const implBinPath = Path.join(implInstallPath, Impls[implName].binPath)
  const ipfsPath = Path.join(homePath, `${implName}-ipfs@${version}`)

  await writeLibBin({ spinner }, libBinPath, implBinPath, ipfsPath)
  await symlink({ spinner }, libBinPath, binPath)

  // If the version wasn't already installed we need to ipfs init
  if (!isInstalled) {
    await ipfsInit({ spinner }, binPath, ipfsPath)

    if (Impls[implName].configure) {
      await configureNode({ spinner }, binPath)
    }
  }

  spinner.stop()
}
