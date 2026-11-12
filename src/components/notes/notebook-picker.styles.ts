import { StyleSheet } from 'react-native';

import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';

const ink = '#503B29';
const hand = { fontFamily: FOLIO_HAND_FONT, color: ink };

export const styles = StyleSheet.create({
  spacer: { height: 56, flexShrink: 0 },
  root: { ...StyleSheet.absoluteFillObject, zIndex: 20, width: '100%' },
  trigger: { minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  label: { ...hand, fontSize: 14 },
  destination: { ...hand, fontSize: 15, flex: 1, flexShrink: 1, minWidth: 0 },
  backdrop: { position: 'absolute', top: 52, left: 0, right: 0, zIndex: 1 },
  menu: { position: 'absolute', top: 52, left: 0, right: 0, zIndex: 2, padding: 12 },
  scroll: { flexShrink: 1 },
  content: { gap: 8, paddingBottom: 4 },
  search: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  input: { ...hand, fontSize: 14, minHeight: 48, minWidth: 0, flex: 1, padding: 0, position: 'relative', zIndex: 1 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, gap: 12 },
  rowCopy: { flex: 1, minWidth: 0, gap: 3 },
  rowName: { ...hand, fontSize: 16, flexShrink: 1 },
  hint: { ...hand, color: '#7A6C5E', fontSize: 11, lineHeight: 16 },
  section: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6, paddingHorizontal: 8 },
  sectionLabel: { ...hand, fontSize: 10, letterSpacing: 1.2 },
  line: { height: 1, backgroundColor: '#D6C0A5', flex: 1 },
  empty: { ...hand, fontSize: 13, lineHeight: 20, padding: 12, color: '#7A6C5E' },
  divider: { height: 1, backgroundColor: '#D6C0A5', marginHorizontal: 8, marginTop: 4 },
  newButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10 },
  plus: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DFEBD8', alignItems: 'center', justifyContent: 'center' },
  newLabel: { ...hand, color: '#285C3F', fontSize: 15, flexShrink: 1 },
  form: { gap: 8, paddingHorizontal: 4 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8 },
  cancel: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  create: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#DDF3E6', borderWidth: 1, borderColor: '#82CFA6' },
  disabled: { backgroundColor: '#E6E0D4', borderColor: '#C7BBA9' },
  disabledText: { color: '#746B5C' },
  error: { ...hand, color: '#9B372C', fontSize: 12 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
