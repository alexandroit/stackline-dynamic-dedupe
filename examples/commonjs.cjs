const dedupe = require('@stackline/dynamic-dedupe')

dedupe.activate()

// CommonJS modules with matching source, filename, and parent identity now
// share one exports object, including packages reached through npm link.
const first = require('./workspace-a/common/shared/index.js')
const second = require('./workspace-b/common/shared/index.js')

console.log(first === second)
dedupe.deactivate()
