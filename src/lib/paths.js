const pkg = require('../../package.json')

// TODO: windows?
exports.libInstallPath = `/usr/local/lib/${pkg.name}`

// TODO: what is the bin path on windows?
exports.binPath = '/usr/local/bin/ipfs'
