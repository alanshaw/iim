#!/usr/bin/env node

const Fs = require('fs')
const Path = require('path')
const Os = require('os')
const ChildProcess = require('child_process')

const env = Object.assign({}, process.env)

if (!env.IPFS_PATH) {
  const ipfsPath = Path.join(Os.homedir(), '{{IPFS_PATH}}')
  Fs.mkdirSync(ipfsPath, { recursive: true })
  env.IPFS_PATH = ipfsPath
}

ChildProcess.spawn('{{IPFS_BIN_PATH}}', process.argv.slice(2), { env, stdio: 'inherit' })
