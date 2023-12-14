#!/usr/bin/env node
/* eslint-disable no-console */

import { promisify } from 'util'
// @ts-expect-error no types
import Npm from 'npm'

process.on('uncaughtException', err => { console.error(err) })
process.on('unhandledRejection', err => { console.error(err); process.exit(1) })

const npm = await promisify(Npm.load)()

if (npm == null) {
  throw new Error('Could not load npm')
}

await promisify(npm.commands.install)(process.cwd(), [process.argv.slice(2)[0]])
