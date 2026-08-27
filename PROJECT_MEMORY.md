---
schema: stackline-package-project-memory-v1
project: 11
package: dynamic-dedupe
target: "@stackline/dynamic-dedupe"
state: BUILDING
decision: GO
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

## Mutable Release Evidence

Populate exact commit, artifact hashes, registry metadata, CI, CodeQL, release,
documentation, and clean-install results after independent publication checks.
