const Path = require('path')
const Os = require('os')
const pkg = require('../../package.json')

// TODO: windows?
exports.installPath = `/usr/local/lib/${pkg.name}`

// TODO: what is the bin path on windows?
exports.binPath = '/usr/local/bin/ipfs'

exports.homePath = Path.join(Os.homedir(), `.${pkg.name}`)
