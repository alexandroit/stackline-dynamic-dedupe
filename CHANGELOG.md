# Changelog

All notable changes to `@stackline/dynamic-dedupe` are documented here.

## 1.0.0 - 2026-08-27

- Preserve the upstream `activate`, `deactivate`, and `reset` API.
- Replace ambiguous identity concatenation with framed SHA-256 inputs.
- Make repeated activation idempotent.
- Restore the exact predecessor loader without clobbering hooks installed later.
- Validate extensions and subdirectory depth with controlled errors.
- Remove the `xtend` runtime dependency.
- Add CommonJS, ESM facade, TypeScript 3.9, and current TypeScript declarations.
- Add copied-tree, symlink, hook-composition, package-alias, and Node 12-24 tests.
- Add reproducible package, CI, CodeQL, SBOM, and registry verification gates.
