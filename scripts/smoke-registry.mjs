import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const registryArgument = process.argv.find((value) => value.startsWith('--registry='))
const registry = registryArgument
  ? registryArgument.slice('--registry='.length)
  : process.env.STACKLINE_REGISTRY || 'http://127.0.0.1:4873'
const version = process.env.STACKLINE_VERSION || '1.0.0'
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-dynamic-registry-'))

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/dynamic-dedupe': version,
      'dynamic-dedupe': `npm:@stackline/dynamic-dedupe@${version}`
    }
  }))

  const installed = spawnSync('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--registry',
    registry
  ], { cwd: temporary, encoding: 'utf8' })
  assert.equal(installed.status, 0, installed.stderr)

  const first = path.join(temporary, 'one', 'common', 'shared', 'index.js')
  const second = path.join(temporary, 'two', 'common', 'shared', 'index.js')
  const source = 'module.exports = { marker: Math.random() }\n'
  await mkdir(path.dirname(first), { recursive: true })
  await mkdir(path.dirname(second), { recursive: true })
  await writeFile(first, source)
  await writeFile(second, source)

  const checked = spawnSync(process.execPath, ['-e', [
    "const direct = require('@stackline/dynamic-dedupe');",
    "const alias = require('dynamic-dedupe');",
    "if (typeof direct.activate !== 'function' || typeof alias.activate !== 'function') process.exit(1);",
    'alias.activate();',
    `if (require(${JSON.stringify(first)}) !== require(${JSON.stringify(second)})) process.exit(1);`,
    'alias.deactivate();'
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(checked.status, 0, checked.stderr)
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log(`Registry direct and legacy-alias checks passed against ${registry}.`)
