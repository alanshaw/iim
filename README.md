# iim

> IPFS install manager

## Install

```sh
npm install -g iim
```

Note: Windows not yet supported!

## Usage

```sh
# Use the latest version of JS IPFS
iim use js
ipfs version
js-ipfs version: 0.34.4

# Use JS IPFS at version 0.33
iim use js 0.33
ipfs version
js-ipfs version: 0.33.1

# Use the latest version of Go IPFS
iim use go
ipfs version
ipfs version 0.4.18

# Use Go IPFS at version 0.4.18
iim use go 0.4.17
ipfs version
ipfs version 0.4.17
```

Adds a symlink at `/usr/local/bin/ipfs` that points to a script that runs IPFS with `IPFS_PATH` set to `~/.iim/js@0.34.4`.

IPFS is installed to `/usr/local/lib/iim/js@0.34.4/node_modules/ipfs` or `/usr/local/lib/iim/go@0.4.18/node_modules/go-ipfs-dep` for example.
