import Path from 'node:path'

export interface Implementation {
  moduleName: string
  binPath: string
  configure: boolean
  update: boolean
}

export const implementations: Record<string, Implementation> = {
  js: {
    moduleName: 'ipfs',
    binPath: Path.join('node_modules', '.bin', 'jsipfs'),
    configure: true,
    update: true
  },
  go: {
    moduleName: 'go-ipfs',
    binPath: Path.join('node_modules', 'go-ipfs', 'go-ipfs', 'ipfs'),
    configure: false,
    update: false
  },
  kubo: {
    moduleName: 'kubo',
    binPath: Path.join('node_modules', 'kubo', 'bin', 'ipfs'),
    configure: false,
    update: false
  }
}
