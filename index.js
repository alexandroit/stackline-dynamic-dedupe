'use strict'

var crypto = require('crypto')
var fs = require('fs')
var path = require('path')

var activeHooks = new Map()
var loadedModules = new Map()

function normalizeExtension (extension) {
  if (!extension) return '.js'
  if (typeof extension !== 'string') throw new TypeError('extension must be a string')
  return extension.charAt(0) === '.' ? extension : '.' + extension
}

function normalizeSubdirs (subdirs) {
  if (typeof subdirs === 'undefined') return 2
  if (typeof subdirs !== 'number' || !Number.isFinite(subdirs) || Math.floor(subdirs) !== subdirs || subdirs < 0) {
    throw new TypeError('subdirs must be a non-negative integer')
  }
  return subdirs
}

function frame (value) {
  var text = String(value)
  return String(Buffer.byteLength(text, 'utf8')) + ':' + text
}

function identityFor (source, filename, subdirs) {
  var directories = path.dirname(filename).split(path.sep)
  var selected = subdirs === 0 ? [] : directories.slice(-subdirs)
  var hash = crypto.createHash('sha256')

  hash.update(frame(source))
  hash.update(frame(path.basename(filename)))
  hash.update(frame(selected.length))
  for (var index = 0; index < selected.length; index += 1) hash.update(frame(selected[index]))

  return hash.digest('hex')
}

function activate (extension, subdirs) {
  var ext = normalizeExtension(extension)
  var depth = normalizeSubdirs(subdirs)
  var existing = activeHooks.get(ext)

  if (existing && existing.enabled) return

  var predecessor = require.extensions[ext]
  if (typeof predecessor !== 'function') {
    throw new Error('No CommonJS loader is registered for extension "' + ext + '"')
  }

  var record = {
    enabled: true,
    predecessor: predecessor,
    wrapper: null
  }

  record.wrapper = function dedupingExtension (module, filename) {
    if (!record.enabled) return record.predecessor(module, filename)

    var source = fs.readFileSync(filename, 'utf8')
    var identity = identityFor(source, filename, depth)
    var loaded = loadedModules.get(identity)

    if (loaded) {
      module.exports = loaded.module.exports
      return
    }

    record.predecessor(module, filename)
    loadedModules.set(identity, { module: module, filename: filename })
  }

  activeHooks.set(ext, record)
  require.extensions[ext] = record.wrapper
}

function deactivate (extension) {
  var ext = normalizeExtension(extension)
  var record = activeHooks.get(ext)

  if (!record) return

  record.enabled = false
  if (require.extensions[ext] === record.wrapper) require.extensions[ext] = record.predecessor
  activeHooks.delete(ext)
}

function reset () {
  loadedModules.clear()
}

exports.activate = activate
exports.deactivate = deactivate
exports.reset = reset
