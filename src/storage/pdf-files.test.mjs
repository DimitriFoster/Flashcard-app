import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function fixture(options = {}) {
  const calls = { picked: 0, removed: [] };
  const native = options.oldBuild ? {} : {
    pickPdfAsync: async () => {
      calls.picked++;
      if (options.error) throw options.error;
      return options.cancelled ? null : options.attachment ?? { fileName: 'pdf-test-123.pdf', size: 123, originalName: '../Lecture.pdf' };
    },
    deletePdfAsync: async (name) => calls.removed.push(name),
  };
  function load(url) {
    const module = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(url, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const require = (id) => {
      if (id === 'react-native') return { Platform: { OS: options.platform ?? 'android' } };
      if (id === 'expo') return { requireOptionalNativeModule: () => native };
      if (id === '@/lib/pdf-note') return load(new URL('../lib/pdf-note.ts', import.meta.url));
      throw new Error(`Unexpected dependency: ${id}`);
    };
    vm.runInThisContext('(function(require,module,exports){' + code + '\n})')(require, module, module.exports);
    return module.exports;
  }
  return { calls, ...load(new URL('./pdf-files.ts', import.meta.url)) };
}

test('PDF picker returns only normalized app-owned metadata', async () => {
  const api = fixture();
  assert.deepEqual(await api.pickPdfFile(), { fileName: 'pdf-test-123.pdf', size: 123, originalName: 'Lecture.pdf' });
  assert.equal(api.calls.picked, 1);
});

test('picker cancellation returns no attachment', async () => {
  const api = fixture({ cancelled: true });
  assert.equal(await api.pickPdfFile(), undefined);
  assert.deepEqual(api.calls.removed, []);
});

test('legacy APKs cannot start the main-activity picker', async () => {
  const api = fixture({ oldBuild: true });
  await assert.rejects(api.pickPdfFile(), /updated Folio APK/);
  assert.equal(api.calls.picked, 0);
});

test('invalid copied metadata is rejected and safe basenames are rolled back', async () => {
  const api = fixture({ attachment: { fileName: 'pdf-test-123.pdf', size: 0, originalName: 'test.pdf' } });
  await assert.rejects(api.pickPdfFile(), /Could not access/);
  assert.deepEqual(api.calls.removed, ['pdf-test-123.pdf']);
  const unsafe = fixture({ attachment: { fileName: '../notes', size: 123, originalName: 'test.pdf' } });
  await assert.rejects(unsafe.pickPdfFile());
  assert.deepEqual(unsafe.calls.removed, []);
});

test('native failures expose safe messages, not provider paths', async () => {
  for (const [code, expected] of [['PDF_INVALID', /does not look like a PDF/], ['PDF_TOO_LARGE', /25 MB/], ['PDF_UNAVAILABLE', /Could not access/]]) {
    const api = fixture({ error: { code, message: 'content://private-provider/sensitive-file' } });
    await assert.rejects(api.pickPdfFile(), (error) => expected.test(error.message) && !error.message.includes('private-provider'));
  }
});
