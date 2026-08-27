'use strict'

var dedupe = require('../')
var count = require('./fixtures/count')

var fixtureRequests = [
  './fixtures/pack1/common/dep-uno/foo',
  './fixtures/pack1/common/dep-uno/bar',
  './fixtures/pack1/common/dep-dos/foo',
  './fixtures/pack2/common/dep-uno/foo',
  './fixtures/pack2/common/dep-uno/bar'
]

function resetFixtures () {
  fixtureRequests.map(require.resolve).forEach(function (filename) {
    delete require.cache[filename]
  })
  dedupe.deactivate()
  dedupe.reset()
  count.count = 0
}

exports.count = count
exports.dedupe = dedupe
exports.resetFixtures = resetFixtures
