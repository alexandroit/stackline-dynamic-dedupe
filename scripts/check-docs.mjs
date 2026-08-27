import { readFile, stat } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const site = new URL('../site-dist/', import.meta.url)
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const metadata = JSON.parse(await readFile(new URL('package-meta.json', site), 'utf8'))
const html = await readFile(new URL('index.html', site), 'utf8')
const app = await readFile(new URL('app.js', site), 'utf8')
const robots = await readFile(new URL('robots.txt', site), 'utf8')
const sitemap = await readFile(new URL('sitemap.xml', site), 'utf8')
const llms = await readFile(new URL('llms.txt', site), 'utf8')
const llmsFull = await readFile(new URL('llms-full.txt', site), 'utf8')
const migration = await readFile(new URL('guides/migration.md', site), 'utf8')
const image = await stat(new URL('assets/dynamic-dedupe-workbench.png', site))

assert(metadata.name === packageJson.name, 'documentation package name is stale')
assert(metadata.version === packageJson.version, 'documentation version is stale')
assert(metadata.runtimeDependencies === 0, 'documentation dependency count is stale')
assert(!html.includes('{{PACKAGE_VERSION}}'), 'HTML version placeholder was not replaced')
assert(html.includes('<link rel="canonical" href="https://alexandro.net/docs/vanilla/dynamic-dedupe/">'), 'canonical URL is missing')
assert(html.includes('SoftwareSourceCode'), 'structured software metadata is missing')
assert(html.includes('index,follow'), 'indexable robots metadata is missing')
assert(html.includes('Dedupe workbench'), 'identity workbench is missing')
assert(app.startsWith("'use strict';"), 'documentation app must start in strict mode')
assert(app.includes('async function evaluate'), 'interactive identity evaluator is missing')
assert(robots.includes('User-agent: *\nAllow: /'), 'robots policy is not open')
assert(count(sitemap, '/dynamic-dedupe/') === 6, 'sitemap must expose exactly six package URLs')
assert(llms.includes('npm install @stackline/dynamic-dedupe'), 'LLM install reference is missing')
assert(llmsFull.includes('preserved symlinks'), 'LLM verification evidence is missing')
assert(migration.includes('dynamic-dedupe@npm:@stackline/dynamic-dedupe'), 'alias guide is missing')
assert(html.includes('./analytics.js'), 'documentation analytics is missing')
assert(image.size > 10_000 && image.size < 600_000, `documentation image size is invalid: ${image.size}`)

for (const [name, value] of Object.entries({ html, llms, llmsFull, migration })) {
  assert(!/(127\.0\.0\.1|localhost|verdaccio)/i.test(value), `${name} exposes a private environment`)
}

console.log(JSON.stringify({ imageBytes: image.size, name: metadata.name, version: metadata.version }))

function count (haystack, needle) {
  return haystack.split(needle).length - 1
}

function assert (condition, message) {
  if (!condition) throw new Error(message)
}
