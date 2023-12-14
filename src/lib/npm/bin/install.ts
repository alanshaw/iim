#!/usr/bin/env node

// @ts-expect-error no types
import Npm from 'npm'
import { promisify } from 'util'

process.on('uncaughtException', err => console.error(err))
process.on('unhandledRejection', err => { console.error(err); process.exit(1) })

async function main () {
  const npm = await promisify(Npm.load)()

  if (npm == null) {
    throw new Error('Could not load npm')
  }

  await promisify(npm.commands.install)(process.cwd(), [process.argv.slice(2)[0]])
}

main()
