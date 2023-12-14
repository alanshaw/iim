import Fs from 'node:fs/promises'
import Os from 'node:os'
import Path from 'node:path'
import { expect } from 'aegir/chai'
import { readPackageUpSync } from 'read-package-up'
import { stubInterface } from 'sinon-ts'
import info from '../src/lib/info.js'
import type { Ora } from 'ora'

describe('info', () => {
  if (Os.platform() === 'win32') {
    it.skip('windows it not supported', () => {})

    return
  }

  it('should get info', async () => {
    const spinner = stubInterface<Ora>()
    const pkg = readPackageUpSync()?.packageJson ?? {} as any

    const binLinkPath = Path.join(Os.tmpdir(), `${pkg.name}${Math.random()}`)
    const installPath = `/usr/local/lib/${pkg.name}`
    const implName = `test-mod-${Math.random()}`
    const version = (Math.random() * 10).toFixed() + '.0.0'
    const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${implName}@${version}`)
    const implBinPath = `${installPath}/${implName}@${version}/ipfs`

    await Fs.symlink(implBinPath, binLinkPath)

    const res = await info({ spinner }, binLinkPath, installPath)

    expect(res.implName).to.equal(implName)
    expect(res.version).to.equal(version)
    expect(res.ipfsPath).to.equal(ipfsPath)
    expect(res.implBinPath).to.equal(implBinPath)
  })

  it('should throw if failed to read symlink', async () => {
    const spinner = stubInterface<Ora>()
    const pkg = readPackageUpSync()?.packageJson ?? {} as any

    const binLinkPath = Path.join(Os.tmpdir(), `${pkg.name}${Math.random()}`)
    const installPath = `/usr/local/lib/${pkg.name}`

    await expect(info({ spinner }, binLinkPath, installPath)).to.eventually.be.rejected
      .with.property('message', 'failed to read IPFS symlink')
  })

  it('should throw for unmanaged install', async () => {
    const spinner = stubInterface<Ora>()
    const pkg = readPackageUpSync()?.packageJson ?? {} as any

    const binLinkPath = Path.join(Os.tmpdir(), `${pkg.name}${Math.random()}`)
    const installPath = `/usr/local/lib/${pkg.name}`
    const implBinPath = '/usr/bin/ipfs'

    await Fs.symlink(implBinPath, binLinkPath)

    await expect(info({ spinner }, binLinkPath, installPath)).to.eventually.be.rejected
      .with.property('message', 'unmanaged IPFS install')
  })
})
