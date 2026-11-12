import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/design';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';
import { pdfNoteSummary } from '@/lib/pdf-note';
import { pdfAvailabilityMessage } from '@/storage/pdf-files';
import { importPdfNote, openPdfNote } from '@/storage/pdf-notes';
import type { StudyNote } from '@/types/note';

export function PdfImportButton({ notebookId, onImported }: {
  notebookId?: string;
  onImported: (note: StudyNote) => void;
}) {
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  async function importFile() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    Keyboard.dismiss();
    try {
      const note = await importPdfNote(notebookId);
      if (note && mounted.current) onImported(note);
    } catch (error) {
      if (mounted.current) Alert.alert('Could not import PDF', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Import PDF"
      accessibilityHint="Save a PDF attachment to open with another app"
      accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={importFile}
      testID="notes-import-pdf" style={({ pressed }) => [styles.importButton, pressed && styles.pressed, busy && styles.disabled]}>
      <Text style={styles.secondaryText}>{busy ? 'Importing PDF...' : '+ Import PDF'}</Text>
    </Pressable>
  );
}

export function PdfAttachmentPanel({ note }: { note: StudyNote }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const unavailable = pdfAvailabilityMessage();

  async function open(choose: boolean) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(undefined);
    try {
      const result = await openPdfNote(note.id, choose);
      if (result === 'no_reader' && mounted.current) {
        setError('No PDF reader was found. Install a reader you trust, then try again.');
      }
    } catch (reason) {
      if (mounted.current) setError(reason instanceof Error ? reason.message : 'Could not open the PDF. Try again.');
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.content} testID="pdf-attachment-panel">
      <View style={styles.badge}><Text style={styles.badgeText}>PDF</Text></View>
      <Text accessibilityRole="header" style={styles.title}>{note.title}</Text>
      <Text style={styles.meta}>{pdfNoteSummary(note)}</Text>
      <Text style={styles.copy}>Kept with your notes. Read it in your preferred PDF app, then come back to Folio.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Open PDF"
        testID="pdf-open" disabled={busy || !!unavailable} accessibilityState={{ disabled: busy || !!unavailable, busy }}
        onPress={() => open(false)} style={({ pressed }) => [styles.primary, pressed && styles.pressed, (busy || !!unavailable) && styles.disabled]}>
        <Text style={styles.primaryText}>{busy ? 'Opening...' : 'Open PDF'}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Open PDF with another app"
        testID="pdf-open-with" disabled={busy || !!unavailable} accessibilityState={{ disabled: busy || !!unavailable }}
        onPress={() => open(true)} style={({ pressed }) => [styles.secondary, pressed && styles.pressed, (busy || !!unavailable) && styles.disabled]}>
        <Text style={styles.secondaryText}>Open with...</Text>
      </Pressable>
      {error || unavailable ? <Text accessibilityLiveRegion="polite" style={styles.error} testID="pdf-open-error">{error || unavailable}</Text> : null}
      <Text style={styles.privacy}>Folio shares only this PDF, read-only. The reader can still keep or upload a copy, so choose an app you trust.</Text>
      <Text style={styles.privacy}>Keep your original file. Folio does not back up PDFs; uninstalling Folio or clearing its data removes its copies.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: '#FFFDF6', borderRadius: 16 },
  content: { padding: 22, gap: 14, flexGrow: 1 },
  badge: { alignSelf: 'flex-start', padding: 12, backgroundColor: '#E6EDD9', borderRadius: 12 },
  badgeText: { color: '#38513C', fontSize: 16, fontWeight: '800' },
  title: { color: COLORS.ink, fontFamily: FOLIO_HAND_FONT, fontSize: 22, lineHeight: 32 },
  meta: { color: COLORS.muted, fontSize: 13 },
  copy: { color: COLORS.ink, fontSize: 15, lineHeight: 23 },
  primary: { minHeight: 52, borderRadius: 16, backgroundColor: '#DDE9CB', borderColor: '#879D75', borderWidth: 1, padding: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#314F36', fontFamily: FOLIO_HAND_FONT, fontSize: 17 },
  secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: 12 },
  secondaryText: { color: COLORS.noteDeep, fontSize: 14, fontWeight: '700' },
  importButton: { minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: COLORS.noteCrayon, backgroundColor: COLORS.notePaper, marginVertical: 4 },
  privacy: { color: COLORS.muted, fontSize: 12, lineHeight: 19 },
  error: { color: COLORS.danger, fontSize: 14, lineHeight: 21 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.55 },
});
