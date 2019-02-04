# iim

[![Build Status](https://travis-ci.org/alanshaw/iim.svg?branch=master)](https://travis-ci.org/alanshaw/iim) [![dependencies Status](https://david-dm.org/alanshaw/iim/status.svg)](https://david-dm.org/alanshaw/iim) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> IPFS install manager

https://youtu.be/C7A3-ycCRWU

<img width="674" alt="screenshot 2019-02-03 at 22 35 58" src="https://user-images.githubusercontent.com/152863/52183862-2b1fdf00-2804-11e9-94b4-17cdb73bd7bf.png">

## Install

```sh
npm install -g iim
```

Note: Windows not yet supported!

## Usage

```sh
# Use the latest version of JS IPFS
$ iim use js
✔ selected js-ipfs version 0.34.4
✔ installed js-ipfs 0.34.4
✔ installed binary at /Users/alan/.iim/dists/js-ipfs@0.34.4/ipfs
✔ initialized IPFS at /Users/alan/.iim/js-ipfs@0.34.4
✔ configured IPFS
✔ symlinked /Users/alan/.iim/dists/js-ipfs@0.34.4/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/js-ipfs@0.34.4/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
js-ipfs version: 0.34.4

# Use JS IPFS at version 0.33
$ iim use js 0.33
✔ selected js-ipfs version 0.33.1
✔ installed js-ipfs 0.33.1
✔ installed binary at /Users/alan/.iim/dists/js-ipfs@0.33.1/ipfs
✔ initialized IPFS at /Users/alan/.iim/js-ipfs@0.33.1
✔ configured IPFS
✔ symlinked /Users/alan/.iim/dists/js-ipfs@0.33.1/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/js-ipfs@0.33.1/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
js-ipfs version: 0.33.1

# Use the latest version of Go IPFS
$ iim use go
✔ selected go-ipfs version 0.4.18
✔ installed go-ipfs 0.4.18
✔ installed binary at /Users/alan/.iim/dists/go-ipfs@0.4.18/ipfs
✔ initialized IPFS at /Users/alan/.iim/go-ipfs@0.4.18
✔ symlinked /Users/alan/.iim/dists/go-ipfs@0.4.18/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/go-ipfs@0.4.18/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
ipfs version 0.4.18

# Use Go IPFS at version 0.4.18
$ iim use go 0.4.17
✔ selected go-ipfs version 0.4.17
✔ installed go-ipfs 0.4.17
✔ installed binary at /Users/alan/.iim/dists/go-ipfs@0.4.17/ipfs
✔ initialized IPFS at /Users/alan/.iim/go-ipfs@0.4.17
✔ symlinked /Users/alan/.iim/dists/go-ipfs@0.4.17/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/go-ipfs@0.4.17/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
ipfs version 0.4.17
```

### How does it work?

A new repo is created and used for each implementation/version combination at `~/.iim/js-ipfs@0.34.4`, for example.

Adds a symlink at `/usr/local/bin/ipfs` that points to a script that runs IPFS with `IPFS_PATH` set to `~/.iim/js-ipfs@0.34.4`.

IPFS is installed to `~/.iim/dists/js-ipfs@0.34.4/node_modules/ipfs` or `~/.iim/dists/go-ipfs@0.4.18/node_modules/go-ipfs-dep` for example.

### Common issues

#### Failed to symlink

Looks like this:

```sh
$ iim use go
✔ selected go-ipfs version 0.4.18
✔ installed go-ipfs 0.4.18
✔ installed binary at /home/dave/.iim/dists/go-ipfs@0.4.18/ipfs
✔ initialized IPFS at /home/dave/.iim/go-ipfs@0.4.18
✔ symlinked /home/dave/.iim/dists/go-ipfs@0.4.18/ipfs -> /home/dave/.iim/dists/current
✖ failed to symlink /home/dave/.iim/dists/go-ipfs@0.4.18/ipfs -> /usr/local/bin/ipfs
💥 failed to link binary at /usr/local/bin/ipfs, try running sudo iim link
```

Don't worry! Mostly everything worked fine - you just don't have permission to write to `/usr/local/bin`! Just run `sudo iim link` and it'll try again to create that symlink.

### How to debug?

You can get some debug output using the `DEBUG` environment variable e.g.

```sh
$ DEBUG=iim* iim use js
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/iim/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
