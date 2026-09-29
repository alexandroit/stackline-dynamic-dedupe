# @stackline/dynamic-dedupe

> Compatibility-first CommonJS module deduplication for linked and copied dependency trees.

[![npm version](https://img.shields.io/npm/v/@stackline/dynamic-dedupe.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/dynamic-dedupe)
[![license](https://img.shields.io/npm/l/@stackline/dynamic-dedupe.svg?style=flat-square)](https://github.com/alexandroit/stackline-dynamic-dedupe)
[![GitHub repository](https://img.shields.io/badge/GitHub-alexandroit%2Fstackline-dynamic-dedupe-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-dynamic-dedupe)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/dynamic-dedupe/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/dynamic-dedupe/)** | **[npm](https://www.npmjs.com/package/@stackline/dynamic-dedupe)** | **[Issues](https://github.com/alexandroit/stackline-dynamic-dedupe/issues)** | **[Repository](https://github.com/alexandroit/stackline-dynamic-dedupe)**

**Current package version:** `1.0.2`

---

## Why this package?

Compatibility-first CommonJS module deduplication for linked and copied
dependency trees. It preserves the small `dynamic-dedupe` API while making
loader restoration, path identity, typing, tests, and release engineering safe
for current Node.js projects.

<a id="why-it-exists"></a>

### Why It Exists

Node normally caches CommonJS modules by resolved filename. With copied package
trees, `npm link`, or `--preserve-symlinks`, equivalent files can resolve to
different filenames and produce separate singleton instances. This package
intercepts a CommonJS extension loader and reuses an earlier exports object when
the following values match:

- file contents;
- basename;
- the configured number of immediate parent directory names.

The default depth is two, matching the upstream package.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/dynamic-dedupe@1.0.2` |
| Node.js runtime | `>=12` |
| CommonJS / primary entry | `./index.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./index.d.ts` |

- Node.js 12 through 24
- CommonJS root and deep imports
- ESM configuration facade
- TypeScript 3.9 and current TypeScript
- npm aliases, copied trees, and `--preserve-symlinks`
- zero runtime dependencies

See the [compatibility contract](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/COMPATIBILITY_CONTRACT.md) and
[migration guide](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/MIGRATION.md). Full interactive documentation is available
at [alexandro.net](https://alexandro.net/docs/vanilla/dynamic-dedupe/).

## Installation

<a id="install"></a>

### Install

```bash
npm install @stackline/dynamic-dedupe
```

For an existing dependency that imports `dynamic-dedupe`, use an npm alias:

```bash
npm install dynamic-dedupe@npm:@stackline/dynamic-dedupe
```

## Usage

Existing CommonJS code does not change:

```js
const dedupe = require('dynamic-dedupe')

dedupe.activate()
const first = require('./workspace-a/common/shared/index.js')
const second = require('./workspace-b/common/shared/index.js')

console.log(first === second) // true when identity inputs match
dedupe.deactivate()
```

<a id="esm"></a>

### ESM

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

## Security

This package changes process-wide CommonJS loader state. Activate it during
controlled process startup and deactivate it when the behavior is no longer
needed. Do not use source equivalence as a security boundary. Review the
[security policy](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/SECURITY.md) to report a vulnerability privately.

## API Surface

<a id="api"></a>

### API

#### `activate(extension?, subdirs?)`

Installs deduplication for an extension. The default extension is `.js`; the
default parent-directory depth is `2`. Repeated activation of an active
extension is idempotent.

```js
const dedupe = require('@stackline/dynamic-dedupe')

dedupe.activate()         // .js, two parent directories
dedupe.activate('.ts', 3) // after a .ts CommonJS loader is registered
```

#### `deactivate(extension?)`

Disables deduplication and restores the exact loader that preceded activation
when the Stackline hook is still the outermost hook. If another tool wrapped it
later, that tool is left intact and the embedded Stackline hook becomes a
pass-through.

#### `reset()`

Clears dedupe identities recorded by this package. It does not clear Node's
`require.cache` and does not deactivate a loader.

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-dynamic-dedupe.git
cd stackline-dynamic-dedupe
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-dynamic-dedupe/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## License

MIT. The original copyright and license are preserved in [LICENSE](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/LICENSE).
Attribution and modification details are recorded in [NOTICE](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/NOTICE) and
[THIRD_PARTY_LICENSES.md](https://github.com/alexandroit/stackline-dynamic-dedupe/blob/main/THIRD_PARTY_LICENSES.md).

## Credits and original authors

- Stackline Maintainers.
- Thorsten Lorenz.
- Copyright 2013 Thorsten Lorenz.
- Copyright 2026 Stackline Maintainers for later modifications.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
