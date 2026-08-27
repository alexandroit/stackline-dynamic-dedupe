'use strict'

var afterEach = require('node:test').afterEach
var test = require('node:test')
var assert = require('node:assert/strict')
var fs = require('node:fs')
var os = require('node:os')
var path = require('node:path')
var dedupe = require('../')

var temporary = []

afterEach(function () {
  dedupe.deactivate('.js')
  dedupe.deactivate('.unit')
  dedupe.reset()
  temporary.splice(0).forEach(function (directory) {
    fs.rmSync(directory, { force: true, recursive: true })
  })
  delete global.__dynamicDedupeCount
  delete global.__dynamicDedupeThrow
})

test('exports the three-function upstream API', function () {
  assert.deepEqual(Object.keys(dedupe).sort(), ['activate', 'deactivate', 'reset'])
  assert.equal(typeof dedupe.activate, 'function')
  assert.equal(typeof dedupe.deactivate, 'function')
  assert.equal(typeof dedupe.reset, 'function')
})

test('accepts an extension without a leading dot', function () {
  var original = require.extensions['.unit']
  require.extensions['.unit'] = require.extensions['.js']
  try {
    dedupe.activate('unit', 0)
    assert.notStrictEqual(require.extensions['.unit'], require.extensions['.js'])
    dedupe.deactivate('unit')
    assert.strictEqual(require.extensions['.unit'], require.extensions['.js'])
  } finally {
    if (original) require.extensions['.unit'] = original
    else delete require.extensions['.unit']
  }
})

test('rejects invalid configuration before changing a loader', function () {
  var original = require.extensions['.js']
  assert.throws(function () { dedupe.activate(7) }, /extension must be a string/)
  assert.throws(function () { dedupe.activate('.js', -1) }, /non-negative integer/)
  assert.throws(function () { dedupe.activate('.js', 1.5) }, /non-negative integer/)
  assert.throws(function () { dedupe.activate('.missing') }, /No CommonJS loader/)
  assert.strictEqual(require.extensions['.js'], original)
})

test('uses boundaries in directory identity inputs', function () {
  var root = makeTemporary()
  var first = writeModule(root, ['a', 'foo', 'bar', 'same.js'], counterSource())
  var second = writeModule(root, ['b', 'fo', 'obar', 'same.js'], counterSource())

  dedupe.activate('.js', 2)
  var one = require(first)
  var two = require(second)

  assert.equal(global.__dynamicDedupeCount, 2)
  assert.notStrictEqual(one, two)
})

test('subdirs zero dedupes matching source and filename across any directory', function () {
  var root = makeTemporary()
  var first = writeModule(root, ['a', 'first', 'same.js'], counterSource())
  var second = writeModule(root, ['b', 'second', 'same.js'], counterSource())

  dedupe.activate('.js', 0)
  var one = require(first)
  var two = require(second)

  assert.equal(global.__dynamicDedupeCount, 1)
  assert.strictEqual(one, two)
})

test('reset forgets dedupe identities without changing loader state', function () {
  var root = makeTemporary()
  var first = writeModule(root, ['a', 'common', 'pkg', 'same.js'], counterSource())
  var second = writeModule(root, ['b', 'common', 'pkg', 'same.js'], counterSource())

  dedupe.activate()
  var one = require(first)
  dedupe.reset()
  var two = require(second)

  assert.equal(global.__dynamicDedupeCount, 2)
  assert.notStrictEqual(one, two)
})

test('does not cache a module whose predecessor loader throws', function () {
  var root = makeTemporary()
  var source = [
    "if (!global.__dynamicDedupeThrow) throw new Error('expected load failure')",
    'module.exports = { loaded: true }'
  ].join('\n')
  var first = writeModule(root, ['a', 'common', 'pkg', 'same.js'], source)
  var second = writeModule(root, ['b', 'common', 'pkg', 'same.js'], source)

  dedupe.activate()
  assert.throws(function () { require(first) }, /expected load failure/)
  global.__dynamicDedupeThrow = true
  assert.deepEqual(require(second), { loaded: true })
})

test('observes a later module.exports reassignment like the upstream registry', async function () {
  var root = makeTemporary()
  var source = [
    'module.exports = { version: 1 }',
    'setImmediate(function () { module.exports = { version: 2 } })'
  ].join('\n')
  var first = writeModule(root, ['a', 'common', 'pkg', 'same.js'], source)
  var second = writeModule(root, ['b', 'common', 'pkg', 'same.js'], source)

  dedupe.activate()
  assert.deepEqual(require(first), { version: 1 })
  await new Promise(function (resolve) { setImmediate(resolve) })
  assert.deepEqual(require(second), { version: 2 })
})

function makeTemporary () {
  var directory = fs.mkdtempSync(path.join(os.tmpdir(), 'stackline-dynamic-dedupe-'))
  temporary.push(directory)
  return directory
}

function writeModule (root, parts, source) {
  var filename = path.join.apply(path, [root].concat(parts))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, source)
  return filename
}

function counterSource () {
  return [
    'global.__dynamicDedupeCount = (global.__dynamicDedupeCount || 0) + 1',
    'module.exports = { count: global.__dynamicDedupeCount }'
  ].join('\n')
}
