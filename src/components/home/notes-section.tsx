import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { COLORS, RADIUS, SHADOWS } from '@/constants/design';

const notesIcon = require('../../../assets/folio-ui/home-page/home_notes_icon.png');
const homeArrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
const notesPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_notes_panel_swatch.png');

type HomeNotesSectionProps = {
  onPressNotes: () => void;
};

export function HomeNotesSection({ onPressNotes }: HomeNotesSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPressNotes}
      style={({ pressed }) => [styles.section, pressed && styles.pressed]}>
      <HomePanelFill source={notesPanelSwatch} opacity={1} />

      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Image source={notesIcon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>notes</Text>
          <Text style={styles.subtitle}>Open a fast lined notebook{`\n`}for loose thoughts.</Text>
        </View>

        <Image
          source={homeArrowIcon}
          style={[styles.arrow, { tintColor: COLORS.noteDeep }]}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 118,
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.notePaper,
    borderWidth: 1,
    borderColor: COLORS.noteCrayon,
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    width: 56,
    height: 56,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: COLORS.noteDeep,
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: '#4F4740',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  arrow: {
    width: 26,
    height: 26,
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
