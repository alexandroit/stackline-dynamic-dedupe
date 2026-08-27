import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-dynamic-dedupe-'))
let tarball

try {
  const packed = spawnSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8'
  })
  assert.equal(packed.status, 0, packed.stderr)
  const packResult = JSON.parse(packed.stdout)[0]
  tarball = path.join(root, packResult.filename)

  const paths = packResult.files.map((file) => file.path)
  assert.equal(paths.some((file) => file.startsWith('test/')), false)
  assert.equal(paths.some((file) => file.startsWith('scripts/')), false)
  assert.equal(paths.includes('LICENSE'), true)
  assert.equal(paths.includes('NOTICE'), true)
  assert.equal(paths.includes('index.d.ts'), true)

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/dynamic-dedupe': `file:${tarball}`
    }
  }))

  const installed = spawnSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: temporary,
    encoding: 'utf8'
  })
  assert.equal(installed.status, 0, installed.stderr)

  const first = path.join(temporary, 'one', 'common', 'shared', 'index.js')
  const second = path.join(temporary, 'two', 'common', 'shared', 'index.js')
  const source = 'module.exports = { marker: Math.random() }\n'
  await mkdir(path.dirname(first), { recursive: true })
  await mkdir(path.dirname(second), { recursive: true })
  await writeFile(first, source)
  await writeFile(second, source)

  const commonjs = spawnSync(process.execPath, ['--input-type=commonjs', '-e', [
    "const direct = require('@stackline/dynamic-dedupe');",
    "const deep = require('@stackline/dynamic-dedupe/index.js');",
    "if (direct !== deep || typeof direct.activate !== 'function') process.exit(1);",
    'direct.activate();',
    `if (require(${JSON.stringify(first)}) !== require(${JSON.stringify(second)})) process.exit(1);`,
    'direct.deactivate();'
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(commonjs.status, 0, commonjs.stderr)

  const esm = spawnSync(process.execPath, ['--input-type=module', '-e', [
    "import direct, { activate, deactivate, reset } from '@stackline/dynamic-dedupe';",
    "if (direct.activate !== activate || typeof deactivate !== 'function' || typeof reset !== 'function') process.exit(1);"
  ].join('')], { cwd: temporary, encoding: 'utf8' })
  assert.equal(esm.status, 0, esm.stderr)

  await writeFile(path.join(temporary, 'consumer.mts'), [
    "import dynamicDedupe, { activate, deactivate, reset } from '@stackline/dynamic-dedupe'",
    "activate('.js', 2)",
    "deactivate('.js')",
    'reset()',
    'dynamicDedupe.activate()'
  ].join('\n'))
  await writeFile(path.join(temporary, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'nodenext',
      moduleResolution: 'nodenext',
      noEmit: true,
      strict: true,
      target: 'es2022',
      types: []
    },
    files: ['consumer.mts']
  }))

  const typeChecked = spawnSync(process.execPath, [
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    '-p',
    path.join(temporary, 'tsconfig.json')
  ], { cwd: temporary, encoding: 'utf8' })
  assert.equal(typeChecked.status, 0, typeChecked.stdout + typeChecked.stderr)

  const manifest = JSON.parse(await readFile(path.join(
    temporary,
    'node_modules',
    '@stackline',
    'dynamic-dedupe',
    'package.json'
  ), 'utf8'))
  assert.equal(manifest.name, '@stackline/dynamic-dedupe')
  assert.deepEqual(manifest.dependencies, undefined)
} finally {
  if (tarball) await rm(tarball, { force: true })
  await rm(temporary, { force: true, recursive: true })
}

console.log('Packed scoped-install, identity, deep-import, ESM, and type checks passed.')
