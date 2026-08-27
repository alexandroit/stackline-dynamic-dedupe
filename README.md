# @stackline/dynamic-dedupe

[![npm version](https://img.shields.io/npm/v/@stackline/dynamic-dedupe.svg)](https://www.npmjs.com/package/@stackline/dynamic-dedupe)
[![CI](https://github.com/alexandroit/stackline-dynamic-dedupe/actions/workflows/ci.yml/badge.svg)](https://github.com/alexandroit/stackline-dynamic-dedupe/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@stackline/dynamic-dedupe.svg)](./LICENSE)

Compatibility-first CommonJS module deduplication for linked and copied
dependency trees. It preserves the small `dynamic-dedupe` API while making
loader restoration, path identity, typing, tests, and release engineering safe
for current Node.js projects.

## Install

```bash
npm install @stackline/dynamic-dedupe
```

For an existing dependency that imports `dynamic-dedupe`, use an npm alias:

```bash
npm install dynamic-dedupe@npm:@stackline/dynamic-dedupe
```

Existing CommonJS code does not change:

```js
const dedupe = require('dynamic-dedupe')

dedupe.activate()
const first = require('./workspace-a/common/shared/index.js')
const second = require('./workspace-b/common/shared/index.js')

console.log(first === second) // true when identity inputs match
dedupe.deactivate()
```

## Why It Exists

Node normally caches CommonJS modules by resolved filename. With copied package
trees, `npm link`, or `--preserve-symlinks`, equivalent files can resolve to
different filenames and produce separate singleton instances. This package
intercepts a CommonJS extension loader and reuses an earlier exports object when
the following values match:

- file contents;
- basename;
- the configured number of immediate parent directory names.

The default depth is two, matching the upstream package.

## API

### `activate(extension?, subdirs?)`

Installs deduplication for an extension. The default extension is `.js`; the
default parent-directory depth is `2`. Repeated activation of an active
extension is idempotent.

```js
const dedupe = require('@stackline/dynamic-dedupe')

dedupe.activate()         // .js, two parent directories
dedupe.activate('.ts', 3) // after a .ts CommonJS loader is registered
```

### `deactivate(extension?)`

Disables deduplication and restores the exact loader that preceded activation
when the Stackline hook is still the outermost hook. If another tool wrapped it
later, that tool is left intact and the embedded Stackline hook becomes a
pass-through.

### `reset()`

Clears dedupe identities recorded by this package. It does not clear Node's
`require.cache` and does not deactivate a loader.

## ESM

Named and default ESM imports are provided for projects that configure the
hook from an ES module:

```js
import { activate, deactivate } from '@stackline/dynamic-dedupe'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
activate()
const service = require('./linked-service.cjs')
deactivate()
```

The hook affects CommonJS `require()` only. It does not intercept native ESM
imports. Use package-manager constraints, peer dependencies, import maps, or a
dedicated Node loader for native ESM graph control.

## Compatibility

- Node.js 12 through 24
- CommonJS root and deep imports
- ESM configuration facade
- TypeScript 3.9 and current TypeScript
- npm aliases, copied trees, and `--preserve-symlinks`
- zero runtime dependencies

See the [compatibility contract](./COMPATIBILITY_CONTRACT.md) and
[migration guide](./MIGRATION.md). Full interactive documentation is available
at [alexandro.net](https://alexandro.net/docs/vanilla/dynamic-dedupe/).

## Security

This package changes process-wide CommonJS loader state. Activate it during
controlled process startup and deactivate it when the behavior is no longer
needed. Do not use source equivalence as a security boundary. Review the
[security policy](./SECURITY.md) to report a vulnerability privately.

## License

MIT. The original copyright and license are preserved in [LICENSE](./LICENSE).
Attribution and modification details are recorded in [NOTICE](./NOTICE) and
[THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
