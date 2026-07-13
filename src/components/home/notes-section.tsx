import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HomePanelFill } from '@/components/home/home-panel-fill';
import { COLORS, RADIUS, SHADOWS } from '@/constants/design';

const notesIcon = require('../../../assets/folio-ui/home-page/home_notes_icon.png');
const homeArrowIcon = require('../../../assets/folio-ui/home-page/home_arrow_icon.png');
const notesPanelSwatch = require('../../../assets/folio-ui/home-page/swatches/home_notes_panel_swatch.png');

type HomeNotesSectionProps = {
  onPressNotes: () => void;
  tabletLayout?: boolean;
};

export function HomeNotesSection({ onPressNotes, tabletLayout = false }: HomeNotesSectionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPressNotes}
      style={({ pressed }) => [styles.section, tabletLayout && styles.sectionTablet, pressed && styles.pressed]}>
      <HomePanelFill source={notesPanelSwatch} opacity={1} />

      {tabletLayout ? (
        <View style={[styles.row, styles.rowTablet]}>
          <View style={styles.tabletTitleLine}>
            <Image source={notesIcon} style={styles.tabletInlineIcon} resizeMode="contain" />
            <Text style={[styles.title, styles.titleTablet]}>notes</Text>
          </View>
          <Text style={[styles.subtitle, styles.subtitleTablet]}>Open a fast lined notebook for loose thoughts.</Text>
        </View>
      ) : (
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
      )}
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
  sectionTablet: {
    alignItems: 'center',
    minHeight: 108,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTablet: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
  },
  tabletTitleLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  tabletInlineIcon: {
    width: 42,
    height: 42,
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
  titleTablet: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4F4740',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  subtitleTablet: {
    maxWidth: 340,
    textAlign: 'center',
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
