'use strict'

var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var dedupe = require('../')

var root = fs.mkdtempSync(path.join(os.tmpdir(), 'stackline-dynamic-runtime-'))
var source = 'module.exports = { marker: Math.random() }\n'
var first = path.join(root, 'one', 'common', 'pkg', 'index.js')
var second = path.join(root, 'two', 'common', 'pkg', 'index.js')

fs.mkdirSync(path.dirname(first), { recursive: true })
fs.mkdirSync(path.dirname(second), { recursive: true })
fs.writeFileSync(first, source)
fs.writeFileSync(second, source)

dedupe.activate()
assert.strictEqual(require(first), require(second))
dedupe.deactivate()
dedupe.reset()
assert.strictEqual(typeof dedupe.activate, 'function')
console.log('Node runtime compatibility passed.')
