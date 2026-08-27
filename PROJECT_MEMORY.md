---
schema: stackline-package-project-memory-v1
project: 11
package: dynamic-dedupe
target: "@stackline/dynamic-dedupe"
state: PUBLISHED
decision: GO
registry_scope: verdaccio-and-public-npm
public_npm: true
public_github: true
docs_production: true
last_updated: 2026-08-27
---

# Project 11 Memory

The project passed the GO gate on 2026-08-27. It preserves the three-function
`dynamic-dedupe@0.3.0` CommonJS contract while correcting loader composition,
identity framing, validation, type ownership, dependencies, and release gates.

## Release Target

- version: `1.0.0`
- Node: 12 through 24
- modules: CommonJS runtime plus ESM configuration facade
- TypeScript: 3.9 plus current
- runtime dependencies: zero
- migration: `dynamic-dedupe@npm:@stackline/dynamic-dedupe`

## Production Release

- package: `@stackline/dynamic-dedupe@1.0.0`;
- npm: https://www.npmjs.com/package/@stackline/dynamic-dedupe;
- Verdaccio: published from the exact same tarball as npm;
- source: https://github.com/alexandroit/stackline-dynamic-dedupe;
- release: https://github.com/alexandroit/stackline-dynamic-dedupe/releases/tag/stackline-v1.0.0;
- documentation: https://alexandro.net/docs/vanilla/dynamic-dedupe/;
- source and tag commit: `9c996dbe29baab3dc9beac981c5b3bd865a8de42`;
- tarball SHA-1: `1dfd9557b1570321bcabaa30caea6dbcf4d0b0ce`;
- tarball SHA-256: `1ed9288564fedf3a8344ece46aa86859adc231b3f882f0c720e89a4a3b12bb6a`;
- npm integrity: `sha512-ZQ1Nz73sADY0DQhzyfVp7rjNuIdHXXT/P9P4HxpDZOmrQ6xXnYTHEQ8sM9eWqKlntbHYhD3TuLK/i5Br6mThGw==`;
- packed size: 6,010 bytes; unpacked size: 16,169 bytes; 14 files;
- CI: https://github.com/alexandroit/stackline-dynamic-dedupe/actions/runs/33041744094;
- CodeQL: https://github.com/alexandroit/stackline-dynamic-dedupe/actions/runs/33041744077.

## Production Verification

- upstream, identity-boundary, hook, symlink, ESM, type, runtime, coverage,
  package, installation, audit, CI, and CodeQL gates passed;
- direct scoped installation and the `dynamic-dedupe` npm alias passed from
  Verdaccio and from the official npm registry;
- npm metadata independently returned the release SHA-1, integrity, file count,
  and unpacked size shown above;
- the public documentation, canonical URL, workbench image, catalog entry, and
  six aggregate sitemap URLs returned through Cloudflare on 2026-08-27.
