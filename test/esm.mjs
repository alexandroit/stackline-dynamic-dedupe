import assert from 'node:assert/strict'
import dynamicDedupe, { activate, deactivate, reset } from '../index.mjs'

assert.strictEqual(dynamicDedupe.activate, activate)
assert.strictEqual(dynamicDedupe.deactivate, deactivate)
assert.strictEqual(dynamicDedupe.reset, reset)
activate()
deactivate()
reset()
console.log('ESM facade checks passed.')
