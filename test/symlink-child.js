'use strict'

var assert = require('node:assert/strict')
var dedupe = require('../')

dedupe.activate()
var first = require(process.argv[2])
var second = require(process.argv[3])

assert.strictEqual(first, second)
assert.equal(global.__dynamicDedupeSymlinkCount, 1)
console.log('symlink dedupe passed')
