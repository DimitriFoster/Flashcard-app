import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '../..');
const navigationRoot = path.dirname(require.resolve('@react-navigation/core/package.json'));
const { getStateFromPath } = await import(pathToFileURL(path.join(navigationRoot, 'lib/module/getStateFromPath.js')));
const { getPathFromState } = await import(pathToFileURL(path.join(navigationRoot, 'lib/module/getPathFromState.js')));
const config = { screens: { Notes: 'notes', Deck: 'review/:deckId' } };

test('clean installs resolve the decoder adapter inside the project packages directory', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  assert.equal(manifest.dependencies['decode-uri-component'], 'file:./packages/decode-uri-component-compat');
  assert.equal(manifest.overrides['decode-uri-component'], '$decode-uri-component');
  const adapter = lock.packages['node_modules/decode-uri-component'];
  assert.equal(adapter.link, true);
  assert.equal(adapter.resolved, 'packages/decode-uri-component-compat');
  assert.ok(lock.packages[adapter.resolved]);
  assert.ok(fs.existsSync(path.join(root, adapter.resolved, 'index.cjs')));
});

test('navigation consumers resolve the patched upstream decoder through the CJS adapter', () => {
  const upstream = JSON.parse(fs.readFileSync(path.join(path.dirname(require.resolve('@folio/uri-decoder-upstream')), 'package.json'), 'utf8'));
  assert.equal(upstream.name, 'decode-uri-component');
  assert.equal(upstream.version, '0.5.0');
  for (const consumer of ['expo-router', '@react-navigation/core']) {
    const consumerRequire = createRequire(require.resolve(`${consumer}/package.json`));
    const queryRequire = createRequire(consumerRequire.resolve('query-string'));
    assert.equal(typeof queryRequire('decode-uri-component'), 'function');
    const query = consumerRequire('query-string');
    assert.deepEqual({ ...query.parse('q=caf%C3%A9+notes&tag=one&tag=two&literal=%25') }, {
      q: 'caf\u00e9 notes', tag: ['one', 'two'], literal: '%',
    });
  }
});

test('React Navigation path parsing and generation preserve real route parameters', () => {
  const state = getStateFromPath('/review/deck-123?search=caf%C3%A9+notes', config);
  assert.equal(state.routes[0].name, 'Deck');
  assert.equal(state.routes[0].params.deckId, 'deck-123');
  assert.equal(state.routes[0].params.search, 'caf\u00e9 notes');
  assert.equal(getPathFromState(state, config), '/review/deck-123?search=caf%C3%A9%20notes');
  assert.equal(getStateFromPath('/notes?q=%ZZ', config).routes[0].params.q, '%ZZ');
});

test('malformed percent-encoded input completes in a time-limited subprocess', () => {
  // A timeout prevents a decoder regression from hanging the test runner itself.
  const result = spawnSync(process.execPath, ['-e', `
    const query = require('query-string');
    for (const input of ['%FF'.repeat(12000), '%C2'.repeat(12000), '%E0%A4%A'.repeat(4000)]) {
      if (typeof query.parse('q=' + input).q !== 'string') process.exit(2);
    }
  `], { cwd: root, timeout: 5000, encoding: 'utf8' });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr);
});
