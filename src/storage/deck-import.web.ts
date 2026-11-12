import * as DocumentPicker from 'expo-document-picker';
import { assertImportText, getDeckFileKind, MAX_IMPORT_BYTES } from '@/lib/import-policy';

let picking = false;
export async function pickDeckFile(): Promise<{ name: string; text: string } | undefined> {
  if (picking) return undefined;
  picking = true;
  try {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: false, base64: false, type: '*/*' });
    if (result.canceled) return undefined;
    const asset = result.assets[0];
    const file = asset.file;
    if (!file) throw new Error('Could not read that file.');
    getDeckFileKind(asset.name);
    if (file.size > MAX_IMPORT_BYTES) throw new Error('Choose a file smaller than 1 MB.');
    // Slice independently of reported size before allocating or decoding.
    const buffer = await file.slice(0, MAX_IMPORT_BYTES + 1).arrayBuffer();
    if (buffer.byteLength > MAX_IMPORT_BYTES) throw new Error('Choose a file smaller than 1 MB.');
    let text: string;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(buffer); }
    catch { throw new Error('Choose a UTF-8 text file.'); }
    assertImportText(text);
    return { name: asset.name, text };
  } finally { picking = false; }
}
