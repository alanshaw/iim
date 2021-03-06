const test = require('ava')
const { promises: Fs } = require('fs')
const Os = require('os')
const Path = require('path')
const mockOra = require('../helpers/mock-ora')
const pkg = require('../../../package.json')
const info = require('../../../src/lib/info')

test('should get info', async t => {
  const spinner = mockOra()

  const binLinkPath = Path.join(Os.tmpdir(), pkg.name + Math.random())
  const installPath = `/usr/local/lib/${pkg.name}`
  const implName = 'test-mod-' + Math.random()
  const version = (Math.random() * 10).toFixed() + '.0.0'
  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${implName}@${version}`)
  const implBinPath = `${installPath}/${implName}@${version}/ipfs`

  await Fs.symlink(implBinPath, binLinkPath)

  const res = await info({ spinner }, binLinkPath, installPath)

  t.is(res.implName, implName)
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
  const implBinPath = '/usr/bin/ipfs'

  await Fs.symlink(implBinPath, binLinkPath)

  const err = await t.throwsAsync(info({ spinner }, binLinkPath, installPath))

  t.is(err.message, 'unmanaged IPFS install')
})
