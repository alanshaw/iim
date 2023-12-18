# iim

<https://youtu.be/C7A3-ycCRWU>

<img width="674" alt="screenshot 2019-02-03 at 22 35 58" src="https://user-images.githubusercontent.com/152863/52183862-2b1fdf00-2804-11e9-94b4-17cdb73bd7bf.png">

[![codecov](https://img.shields.io/codecov/c/github/alanshaw/iim.svg?style=flat-square)](https://codecov.io/gh/alanshaw/iim)
[![CI](https://img.shields.io/github/actions/workflow/status/alanshaw/iim/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/alanshaw/iim/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> IPFS install manager

## Install

```console
$ npm i -g iim
```

Note: Windows not yet supported!

## Usage

**Example - Use the latest version of Kubo**

```sh
$ iim use kubo
✔ selected kubo version 0.24.0
✔ installed kubo 0.24.0
✔ installed binary at /Users/alan/.iim/dists/kubo@0.24.0/ipfs
✔ initialized IPFS at /Users/alan/.iim/kubo@0.24.0
✔ configured IPFS
✔ symlinked /Users/alan/.iim/dists/kubo@0.24.0/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/kubo@0.24.0/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
kubo version: 0.24.0
```

**Example - Use Kubo at version 0.23.0**

```sh
$ iim use kubo 0.23
✔ selected kubo version 0.23.0
✔ installed kubo 0.23.0
✔ installed binary at /Users/alan/.iim/dists/kubo@0.23.0/ipfs
✔ initialized IPFS at /Users/alan/.iim/kubo@0.23.0
✔ configured IPFS
✔ symlinked /Users/alan/.iim/dists/kubo@0.23.0/ipfs -> /Users/alan/.iim/dists/current
✔ symlinked /Users/alan/.iim/dists/kubo@0.23.0/ipfs -> /usr/local/bin/ipfs
🚀 IPFS is ready to use

$ ipfs version
kubo version: 0.23.0
```

## How does it work?

A new repo is created and used for each implementation/version combination at `~/.iim/kubo@0.24.0`, for example.

Adds a symlink at `/usr/local/bin/ipfs` that points to a script that runs IPFS with `IPFS_PATH` set to `~/.iim/kubo@0.24.0`.

IPFS is installed to `~/.iim/dists/kubo@0.24.0/node_modules/ipfs` or `~/.iim/dists/go-ipfs@0.4.18/node_modules/go-ipfs-dep` for example.

## Common issues

### Failed to symlink

Looks like this:

```sh
$ iim use kubo
✔ selected kubo version 0.4.18
✔ installed kubo 0.4.18
✔ installed binary at /home/dave/.iim/dists/kubo@0.4.18/ipfs
✔ initialized IPFS at /home/dave/.iim/kubo@0.4.18
✔ symlinked /home/dave/.iim/dists/kubo@0.4.18/ipfs -> /home/dave/.iim/dists/current
✖ failed to symlink /home/dave/.iim/dists/kubo@0.4.18/ipfs -> /usr/local/bin/ipfs
💥 failed to link binary at /usr/local/bin/ipfs, try running sudo iim link
```

Don't worry! Mostly everything worked fine - you just don't have permission to write to `/usr/local/bin`! Just run `sudo iim link` and it'll try again to create that symlink.

Feel free to dive in! [Open an issue](https://github.com/alanshaw/iim/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
