'use strict'

var assert = require('node:assert/strict')
var fs = require('node:fs')
var os = require('node:os')
var path = require('node:path')
var spawnSync = require('node:child_process').spawnSync

var root = fs.mkdtempSync(path.join(os.tmpdir(), 'stackline-dynamic-symlink-'))
var source = path.join(root, 'source', 'common', 'linked-package')
var first = path.join(root, 'first', 'common', 'linked-package')
var second = path.join(root, 'second', 'common', 'linked-package')

try {
  fs.mkdirSync(source, { recursive: true })
  fs.mkdirSync(path.dirname(first), { recursive: true })
  fs.mkdirSync(path.dirname(second), { recursive: true })
  fs.writeFileSync(path.join(source, 'index.js'), [
    'global.__dynamicDedupeSymlinkCount = (global.__dynamicDedupeSymlinkCount || 0) + 1',
    'module.exports = { count: global.__dynamicDedupeSymlinkCount }'
  ].join('\n'))
  fs.symlinkSync(source, first, process.platform === 'win32' ? 'junction' : 'dir')
  fs.symlinkSync(source, second, process.platform === 'win32' ? 'junction' : 'dir')

  var child = spawnSync(process.execPath, [
    '--preserve-symlinks',
    path.join(__dirname, 'symlink-child.js'),
    path.join(first, 'index.js'),
    path.join(second, 'index.js')
  ], { encoding: 'utf8' })

  assert.equal(child.status, 0, child.stdout + child.stderr)
  assert.match(child.stdout, /symlink dedupe passed/)
} finally {
  fs.rmSync(root, { force: true, recursive: true })
}

console.log('Preserve-symlinks integration passed.')
