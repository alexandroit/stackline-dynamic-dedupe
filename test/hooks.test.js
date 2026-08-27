'use strict'

var afterEach = require('node:test').afterEach
var test = require('node:test')
var assert = require('node:assert/strict')
var fs = require('node:fs')
var os = require('node:os')
var path = require('node:path')
var dedupe = require('../')

var originalJsLoader = require.extensions['.js']
var temporary = []

afterEach(function () {
  dedupe.deactivate('.js')
  dedupe.reset()
  require.extensions['.js'] = originalJsLoader
  temporary.splice(0).forEach(function (directory) {
    fs.rmSync(directory, { force: true, recursive: true })
  })
  delete global.__dynamicDedupeHookCount
})

test('activation is idempotent and deactivation restores the exact predecessor', function () {
  var calls = 0
  var predecessor = function (module, filename) {
    calls += 1
    originalJsLoader(module, filename)
  }
  require.extensions['.js'] = predecessor

  dedupe.activate()
  var firstWrapper = require.extensions['.js']
  dedupe.activate()

  assert.strictEqual(require.extensions['.js'], firstWrapper)
  dedupe.deactivate()
  assert.strictEqual(require.extensions['.js'], predecessor)

  var fixture = createModule('plain.js')
  require(fixture)
  assert.equal(calls, 1)
})

test('does not clobber a hook installed after activation', function () {
  dedupe.activate()
  var inner = require.extensions['.js']
  var outerCalls = 0
  var outer = function (module, filename) {
    outerCalls += 1
    inner(module, filename)
  }
  require.extensions['.js'] = outer

  dedupe.deactivate()
  assert.strictEqual(require.extensions['.js'], outer)

  var first = createModule(path.join('a', 'common', 'pkg', 'same.js'))
  var second = createModule(path.join('b', 'common', 'pkg', 'same.js'))
  require(first)
  require(second)

  assert.equal(outerCalls, 2)
  assert.equal(global.__dynamicDedupeHookCount, 2)
})

test('can reactivate safely when a disabled wrapper remains inside another hook', function () {
  dedupe.activate()
  var inner = require.extensions['.js']
  var outer = function (module, filename) { inner(module, filename) }
  require.extensions['.js'] = outer
  dedupe.deactivate()

  dedupe.activate()
  var first = createModule(path.join('a', 'common', 'pkg', 'same.js'))
  var second = createModule(path.join('b', 'common', 'pkg', 'same.js'))
  var one = require(first)
  var two = require(second)

  assert.equal(global.__dynamicDedupeHookCount, 1)
  assert.strictEqual(one, two)

  dedupe.deactivate()
  assert.strictEqual(require.extensions['.js'], outer)
})

test('deactivation and reset are idempotent when inactive', function () {
  assert.doesNotThrow(function () {
    dedupe.deactivate()
    dedupe.deactivate()
    dedupe.reset()
    dedupe.reset()
  })
})

function createModule (relative) {
  var root = temporary[0]
  if (!root) {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'stackline-dynamic-hook-'))
    temporary.push(root)
  }
  var filename = path.join(root, relative)
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, [
    'global.__dynamicDedupeHookCount = (global.__dynamicDedupeHookCount || 0) + 1',
    'module.exports = { count: global.__dynamicDedupeHookCount }'
  ].join('\n'))
  return filename
}
