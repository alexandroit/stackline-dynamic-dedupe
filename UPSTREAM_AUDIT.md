# Upstream Audit

Audit date: 2026-08-27

## Baseline

- repository: `thlorenz/dynamic-dedupe`
- release: `0.3.0` from 2017-11-02
- license: MIT
- runtime dependency: `xtend@^4.0.0`
- public API: `activate`, `deactivate`, `reset`

## Findings

- npm measured 94,487,939 downloads in the audited annual window and
  10,138,473 in the latest 30-day window.
- `node-dev` and `ts-node-dev` remain direct dependents.
- The production dependency graph had no audit finding at review time.
- The historical development graph had seven audit findings through the old
  Tap toolchain; none is carried into the Stackline package.
- Open upstream work only proposed removing deprecated `xtend`; no maintained
  first-party type declarations or modern loader tests existed.
- Ambiguous path-string concatenation and global loader restoration created
  concrete correctness risks on current tooling stacks.

## Scope Decision

The Stackline release keeps CommonJS compatibility and does not introduce an
experimental native ESM loader. This avoids turning a narrow, stable API into a
different package with substantially different runtime semantics.
