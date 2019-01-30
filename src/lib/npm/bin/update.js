#!/usr/bin/env node

const Npm = require('npm')
const { promisify } = require('util')

process.on('uncaughtException', err => console.error(err))
process.on('unhandledRejection', err => { console.error(err); process.exit(1) })

async function main () {
  const npm = await promisify(Npm.load)()
  await promisify(npm.commands.update)()
}

main()
