# Dependency Decisions

## Runtime

The package has zero runtime dependencies.

- `xtend` was removed because only a shallow snapshot was used upstream.
- Node built-ins provide filesystem access, path handling, and SHA-256 hashing.
- A `Map` avoids prototype-sensitive registry keys.

## Development

Development tools are pinned for reproducibility:

- ESLint for source and documentation checks;
- Node's built-in test runner for behavior tests;
- c8 for coverage;
- publint and Are The Types Wrong for package-contract checks;
- TypeScript 3.9 and current TypeScript for declaration compatibility.

Development dependencies are not shipped to consumers.
