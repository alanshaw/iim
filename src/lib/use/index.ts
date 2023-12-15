import Path from 'path'
import Chalk from 'chalk'
// @ts-expect-error no types
import explain from 'explain-error'
import { implementations } from '../../implementations.js'
import configureNode from './configure-node.js'
import ipfsInit from './ipfs-init.js'
import npmInstall from './npm-install.js'
import selectVersion from './select-version.js'
import symlink from './symlink.js'
import writeLibBin from './write-lib-bin.js'
import type { Context } from '../../bin.js'

export default async function use (
  ctx: Required<Context>,
  implName: string,
  versionRange: string,
  includePre: boolean,
  includeDeprecated: boolean,
  binPath: string,
  installPath: string,
  homePath: string,
  currentBinLinkPath: string
): Promise<void> {
  const { spinner, npm } = ctx

  if (implName == null) {
    throw new Error('missing implementation name')
  }

  if (!Object.keys(implementations).includes(implName)) {
    throw new Error(`unknown implementation ${implName}`)
  }

  // Select the version we want to use based on the input range
  const version = await selectVersion(
    { npm, spinner },
    implementations[implName].moduleName,
    versionRange,
    { moduleTitle: `${implName}-ipfs`, includePre, includeDeprecated }
  )

  const implInstallPath = Path.join(installPath, `${implName}-ipfs@${version}`)
  const isInstalled = await npmInstall(
    { npm, spinner },
    implementations[implName].moduleName,
    version,
    implInstallPath,
    { update: implementations[implName].update }
  )

  // /usr/local/bin/ipfs
  // -> ~/.iim/dists/js-ipfs@0.34.4/ipfs
  // -> ~/.iim/dists/js-ipfs@0.34.4/node_modules/.bin/jsipfs
  const libBinPath = Path.join(implInstallPath, 'ipfs')
  const implBinPath = Path.join(implInstallPath, implementations[implName].binPath)
  const ipfsPath = Path.join(homePath, `${implName}-ipfs@${version}`)

  await writeLibBin({ spinner }, libBinPath, implBinPath, ipfsPath)

  // If the version wasn't already installed we need to ipfs init
  if (!isInstalled) {
    await ipfsInit({ spinner }, libBinPath, ipfsPath)

    if (implementations[implName].configure) {
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
