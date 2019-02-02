const Path = require('path')
const Os = require('os')
const pkg = require('../../package.json')

// TODO: windows?
exports.libInstallPath = `/usr/local/lib/${pkg.name}`

// TODO: what is the bin path on windows?
exports.binPath = '/usr/local/bin/ipfs'

exports.ipfsPath = (mod, version) => {
  return Path.join(Os.homedir(), `.${pkg.name}`, `${mod}@${version}`)
}
