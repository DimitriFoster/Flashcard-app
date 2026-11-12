import { StyleSheet } from 'react-native';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';

const ink = '#514034';
const muted = '#8B7767';

export const looseNotesStyles = StyleSheet.create({
  page: { gap: 16, paddingHorizontal: 8, paddingBottom: 12 },
  heading: { gap: 5, paddingHorizontal: 5, paddingTop: 10 },
  title: { color: ink, fontFamily: FOLIO_HAND_FONT, fontSize: 30, lineHeight: 41 },
  subtitle: { color: ink, fontSize: 15, lineHeight: 22 },
  quickCard: { paddingTop: 25, paddingHorizontal: 26, paddingBottom: 25, gap: 12 },
  quickHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 12 },
  quickTitle: { color: ink, fontFamily: FOLIO_HAND_FONT, fontSize: 22, lineHeight: 32, flexShrink: 1 },
  input: {
    position: 'relative', zIndex: 1, color: ink, fontSize: 17, lineHeight: 25, height: 96, padding: 0, paddingTop: 2,
    textAlignVertical: 'top', backgroundColor: 'transparent',
  },
  inputCompact: { height: 88 },
  hint: { color: muted, fontSize: 12, lineHeight: 18 },
  save: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 12 },
  saveText: { color: ink, fontFamily: FOLIO_HAND_FONT, fontSize: 17, lineHeight: 24, flexShrink: 1 },
  disabled: { opacity: 0.46 },
  section: { gap: 10 },
  sectionHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 5 },
  sectionCopy: { gap: 4, flexShrink: 1 },
  eyebrow: { color: ink, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, lineHeight: 16 },
  count: { color: muted, fontSize: 13, lineHeight: 18 },
  newButton: {
    minHeight: 48, borderWidth: 1, borderColor: '#69513F', borderRadius: 26,
    paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  newText: { color: ink, fontSize: 14, lineHeight: 21, flexShrink: 1 },
  list: { gap: 10 },
  card: { padding: 6 },
  openArea: { minHeight: 102, paddingLeft: 14, paddingVertical: 13, paddingRight: 50, justifyContent: 'center' },
  cardCopy: { flex: 1, minWidth: 0, gap: 4 },
  cardTitle: { color: ink, fontFamily: FOLIO_HAND_FONT, fontSize: 17, lineHeight: 25 },
  preview: { color: '#665244', fontSize: 13, lineHeight: 19 },
  chevron: { position: 'absolute', right: 14, top: 24, alignItems: 'center' },
  date: { color: muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  menuButton: { position: 'absolute', bottom: 0, right: 0, minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  menu: { borderTopWidth: 1, borderTopColor: '#E8DDCE', marginHorizontal: 12, paddingTop: 10, paddingBottom: 10, gap: 8 },
  delete: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10 },
  deleteText: { color: '#984B42', fontSize: 14, lineHeight: 21 },
  empty: { minHeight: 132, padding: 24, justifyContent: 'center', gap: 6 },
  emptyTitle: { color: ink, fontFamily: FOLIO_HAND_FONT, fontSize: 20, lineHeight: 29 },
  emptyCopy: { color: muted, fontSize: 14, lineHeight: 21 },
  footer: { color: muted, fontSize: 11, lineHeight: 17, textAlign: 'center', paddingHorizontal: 16 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
});
