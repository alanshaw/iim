const help = `
iim - Manage your IPFS installs.

Usage:
  iim <command> [options...]

Command:
  use <impl> [version]  Install and use an IPFS implementation. \`impl\` can be
                        "js", "go" or "kubo" and \`version\` must be a valid semver
                        version or range.
  info                  Get info about the IPFS implementation currently in use.
  link                  Symlink the current install as /usr/local/bin/ipfs
  list [impl]           List the installed IPFS versions optionally filtered by
                        implementation.
  version               Print the version of this tool.

Options:
  --help, -h            Get help for a particular command.
`

const options = {}

export default {
  aliases: [],
  help,
  options,
  run: () => {
    console.info(help)
  }
}
