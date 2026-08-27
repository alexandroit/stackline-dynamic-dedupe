# Contributing

1. Use a supported Node.js release.
2. Run `npm ci`.
3. Add focused tests for every behavior change.
4. Run `npm run verify` before opening a pull request.
5. Keep the upstream API stable across the 1.x line.

Do not include generated credentials, registry tokens, private hostnames, or
consumer source code. Security reports belong in private vulnerability
reporting, as described in [SECURITY.md](./SECURITY.md).
