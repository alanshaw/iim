#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const ChildProcess = require('child_process')
const Fs = require('fs')
const Os = require('os')
const Path = require('path')

const env = Object.assign({}, process.env)

if (env.IPFS_PATH == null) {
  const ipfsPath = Path.join(Os.homedir(), '{{IPFS_PATH}}')
  Fs.mkdirSync(ipfsPath, { recursive: true })
  env.IPFS_PATH = ipfsPath
}

ChildProcess.spawn('{{IPFS_BIN_PATH}}', process.argv.slice(2), { env, stdio: 'inherit' })
