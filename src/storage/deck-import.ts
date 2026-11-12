import { requireOptionalNativeModule } from 'expo';
import { assertImportText, getDeckFileKind } from '@/lib/import-policy';

type PickedDeck = { name: string; text: string };
let picking = false;
export async function pickDeckFile(): Promise<PickedDeck | undefined> {
  if (picking) return undefined;
  const native = requireOptionalNativeModule<{ pickDeckAsync?: () => Promise<PickedDeck | null> }>('FolioPdfFiles');
  if (!native?.pickDeckAsync) throw new Error('Install the updated Folio build to import files securely. You can still paste card rows.');
  picking = true;
  try {
    const result = await native.pickDeckAsync();
    if (!result) return undefined;
    if (typeof result.name !== 'string' || typeof result.text !== 'string') throw new Error('Invalid import result.');
    getDeckFileKind(result.name);
    assertImportText(result.text);
    return result;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'IMPORT_TOO_LARGE') throw new Error('Choose a file smaller than 1 MB.');
    if (code === 'IMPORT_TYPE') throw new Error('Choose CSV, TSV, TXT, JSON, or .foliopack. Export spreadsheets as CSV first.');
    if (code) throw new Error('Could not read that file safely. Choose a UTF-8 text file under 1 MB.');
    throw error;
  } finally { picking = false; }
}
