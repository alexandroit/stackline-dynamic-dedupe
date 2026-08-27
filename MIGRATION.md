# Migration

## Direct Install

```bash
npm install @stackline/dynamic-dedupe
```

```js
const dedupe = require('@stackline/dynamic-dedupe')
dedupe.activate()
```

## Drop-In Alias

Keep an existing `require('dynamic-dedupe')` call unchanged:

```bash
npm install dynamic-dedupe@npm:@stackline/dynamic-dedupe
```

The dependency entry becomes:

```json
{
  "dependencies": {
    "dynamic-dedupe": "npm:@stackline/dynamic-dedupe@^1.0.0"
  }
}
```

## Transitive Consumer Override

For a tool such as `node-dev`, prefer the package manager's supported override
or resolution mechanism and verify the resulting lockfile. npm aliases can be
used as a direct dependency when the tool resolves `dynamic-dedupe` from the
application root.

## Loader Order

Register transpiler loaders before calling `activate()` whenever possible. The
Stackline hook captures and delegates to the loader active at that moment.

## Native ESM

No migration can make `require.extensions` control native ESM. Keep the package
for CommonJS files reached through `require()` and use native ESM dependency
controls separately.
