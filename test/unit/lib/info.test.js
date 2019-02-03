import test from 'ava'
import { promises as Fs } from 'fs'
import Os from 'os'
import Path from 'path'
import mockOra from '../helpers/mock-ora'
import pkg from '../../../package.json'
import info from '../../../src/lib/info'

test('should get info', async t => {
  const spinner = mockOra()

  const binLinkPath = Path.join(Os.tmpdir(), pkg.name + Math.random())
  const installPath = `/usr/local/lib/${pkg.name}`
  const moduleName = 'test-mod-' + Math.random()
  const version = (Math.random() * 10).toFixed() + '.0.0'
  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${moduleName}@${version}`)
  const implBinPath = `${installPath}/${moduleName}@${version}/ipfs`

  await Fs.symlink(implBinPath, binLinkPath)

  const res = await info({ spinner }, binLinkPath, installPath)

  t.is(res.moduleName, moduleName)
  t.is(res.version, version)
  t.is(res.ipfsPath, ipfsPath)
  t.is(res.implBinPath, implBinPath)
})

test('should throw if failed to read symlink', async t => {
  const spinner = mockOra()

  const binLinkPath = Path.join(Os.tmpdir(), pkg.name + Math.random())
  const installPath = `/usr/local/lib/${pkg.name}`

  const err = await t.throwsAsync(info({ spinner }, binLinkPath, installPath))

  t.is(err.message, 'failed to read IPFS symlink')
})

test('should throw for unmanaged install', async t => {
  const spinner = mockOra()

  const binLinkPath = Path.join(Os.tmpdir(), pkg.name + Math.random())
  const installPath = `/usr/local/lib/${pkg.name}`
  const implBinPath = `/usr/bin/ipfs`

  await Fs.symlink(implBinPath, binLinkPath)

  const err = await t.throwsAsync(info({ spinner }, binLinkPath, installPath))

  t.is(err.message, 'unmanaged IPFS install')
})
