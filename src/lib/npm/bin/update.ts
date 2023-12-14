#!/usr/bin/env node
/* eslint-disable no-console */

import { promisify } from 'util'
// @ts-expect-error no types
import Npm from 'npm'

process.on('uncaughtException', err => { console.error(err) })
process.on('unhandledRejection', err => { console.error(err); process.exit(1) })

const npm = await promisify(Npm.load)()

await promisify(npm.commands.update)()
