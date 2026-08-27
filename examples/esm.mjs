import { activate, deactivate } from '@stackline/dynamic-dedupe'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
activate()

const first = require('./workspace-a/common/shared/index.js')
const second = require('./workspace-b/common/shared/index.js')

console.log(first === second)
deactivate()
