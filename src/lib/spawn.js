const ChildProcess = require('child_process')
const log = require('debug')('iim:lib:spawn')

module.exports = async (file, args, opts) => {
  opts = opts || {}

  if (!Array.isArray(args)) {
    args = [args]
  }

  log([file, ...args].join(' '))

  const execOpts = { cwd: opts.cwd || process.cwd() }

  if (opts.env) {
    execOpts.env = opts.env
  }

  return new Promise((resolve, reject) => {
    const proc = ChildProcess.spawn(file, args, execOpts)

    proc.stdout.on('data', d => log(d.toString().trim()))
    proc.stderr.on('data', d => log(d.toString().trim()))

    proc.on('close', code => {
      if (code) {
        return reject(new Error(`command failed "${[file, ...args].join(' ')}"`))
      }
      resolve()
    })
  })
}
