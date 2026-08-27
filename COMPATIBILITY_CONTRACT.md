# Compatibility Contract

The 1.x line preserves the observable `dynamic-dedupe@0.3.0` contract unless a
change is required to prevent loader corruption or ambiguous identity matches.

## Preserved

- `activate([extension, subdirs])`
- `deactivate([extension])`
- `reset()`
- `.js` as the default extension
- two matching parent directories by default
- one shared exports object for equivalent CommonJS modules
- copied, linked, and preserved-symlink module trees

## Additive

- extension names may omit the leading dot;
- invalid configuration fails before loader mutation;
- CommonJS deep imports and package metadata exports;
- ESM configuration facade;
- TypeScript 3.9 and current declarations.

## Intentionally Different

- Identity fields are length-framed before SHA-256 hashing. Distinct directory
  components no longer collide merely because their concatenated text matches.
- `deactivate()` never overwrites a loader installed by another tool after
  Stackline activation. An embedded disabled hook becomes a pass-through.
- Repeated activation is idempotent instead of wrapping the same extension
  repeatedly.

## Outside The Contract

- native ESM import deduplication;
- deduplication across processes, workers, or VM contexts;
- equality of modules with different source text;
- source-code trust or integrity verification;
- mutation of Node's existing `require.cache` entries.
