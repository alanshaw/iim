const Path = require('path')
const Os = require('os')
const pkg = require('../package.json')

const homePath = Path.join(Os.homedir(), `.${pkg.name}`)
const installPath = Path.join(homePath, 'dists')

exports.installPath = installPath

// TODO: windows?
// TODO: what is the bin path on windows?
exports.binPath = '/usr/local/bin/ipfs'

exports.homePath = homePath

exports.currentBinLinkPath = Path.join(installPath, 'current')
