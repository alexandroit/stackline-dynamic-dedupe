# Adoption Targets

## Primary

- projects that currently depend directly on `dynamic-dedupe`;
- `node-dev --dedupe` users working with linked peer dependencies;
- CommonJS monorepos that run with `--preserve-symlinks`;
- development tools that need singleton identity across copied package trees.

## Migration Message

The package is a drop-in API continuation with zero runtime dependencies,
first-party types, current Node testing, safer loader composition, and explicit
CommonJS scope.

## Non-Targets

- native ESM graph rewriting;
- lockfile deduplication;
- application-level event or request deduplication;
- security isolation between executable modules.
