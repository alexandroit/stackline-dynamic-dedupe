'use strict'

var afterEach = require('node:test').afterEach
var test = require('node:test')
var assert = require('node:assert/strict')
var helpers = require('./helpers')
var count = helpers.count
var dedupe = helpers.dedupe
var reset = helpers.resetFixtures

afterEach(reset)

test('dedupes matching modules from copied trees', function () {
  reset()
  dedupe.activate('.js')
  var first = require('./fixtures/pack1/common/dep-uno/foo')
  var second = require('./fixtures/pack2/common/dep-uno/foo')

  assert.equal(count.count, 1)
  assert.equal(first.foo, 'foobiloo')
  assert.strictEqual(first, second)
})

test('does not dedupe different dependency directories', function () {
  reset()
  dedupe.activate('.js')
  require('./fixtures/pack1/common/dep-dos/foo')
  require('./fixtures/pack2/common/dep-uno/foo')
  assert.equal(count.count, 2)
})

test('does not dedupe different filenames', function () {
  reset()
  dedupe.activate('.js')
  require('./fixtures/pack1/common/dep-uno/foo')
  require('./fixtures/pack1/common/dep-uno/bar')
  assert.equal(count.count, 2)
})

test('dedupes another matching filename', function () {
  reset()
  dedupe.activate('.js')
  var first = require('./fixtures/pack1/common/dep-uno/bar')
  var second = require('./fixtures/pack2/common/dep-uno/bar')
  assert.equal(count.count, 1)
  assert.strictEqual(first, second)
})

test('deactivation restores ordinary loading', function () {
  reset()
  dedupe.activate('.js')
  require('./fixtures/pack1/common/dep-uno/foo')
  dedupe.deactivate('.js')
  require('./fixtures/pack2/common/dep-uno/foo')
  assert.equal(count.count, 2)
})

test('honors a larger subdirectory match depth', function () {
  reset()
  dedupe.activate('.js', 3)
  require('./fixtures/pack1/common/dep-uno/foo')
  require('./fixtures/pack2/common/dep-uno/foo')
  assert.equal(count.count, 2)
})
