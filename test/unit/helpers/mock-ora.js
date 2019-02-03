const noop = () => {}

module.exports = () => ({
  start: noop,
  succeed: noop,
  fail: noop,
  stop: noop
})
