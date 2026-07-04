import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { folioReviewAssets } from './folioReviewAssets';
import { FolioTab } from './types';

type Props = {
  activeTab?: FolioTab;
  onNavigateTab?: (tab: FolioTab) => void;
};

const TAB_ITEMS: Array<{ tab: FolioTab; label: string; inactiveIcon: any; activeIcon?: any }> = [
  { tab: 'review', label: 'Review', inactiveIcon: folioReviewAssets.bottomNav.reviewIconInactive, activeIcon: folioReviewAssets.bottomNav.reviewActiveIcon },
  { tab: 'notes', label: 'Notes', inactiveIcon: folioReviewAssets.bottomNav.notesIconInactive },
  { tab: 'progress', label: 'Progress', inactiveIcon: folioReviewAssets.bottomNav.progressIconInactive },
  { tab: 'browse', label: 'Browse', inactiveIcon: folioReviewAssets.bottomNav.browseIconInactive, activeIcon: folioReviewAssets.bottomNav.browseIconActive },
];

export function BottomTabBar({ activeTab = 'review', onNavigateTab }: Props) {
  return (
    <ImageBackground source={folioReviewAssets.bottomNav.shell} resizeMode="stretch" style={styles.shell} imageStyle={styles.shellImage}>
      {TAB_ITEMS.map((item) => {
        const active = item.tab === activeTab;
        return (
          <TabItem
            active={active}
            icon={active ? item.activeIcon ?? item.inactiveIcon : item.inactiveIcon}
            key={item.tab}
            label={item.label}
            onPress={() => onNavigateTab?.(item.tab)}
          />
        );
      })}
    </ImageBackground>
  );
}

function TabItem({
  active,
  label,
  icon,
  onPress,
}: {
  active?: boolean;
  label: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: !!active }} accessibilityLabel={label} onPress={onPress} style={styles.tab}>
      <Image source={icon} resizeMode="contain" style={styles.icon} />
      <Text allowFontScaling={false} style={[styles.label, active ? styles.activeLabel : null]}>{label}</Text>
      {active ? <Image source={folioReviewAssets.bottomNav.reviewActiveUnderline} resizeMode="stretch" style={styles.underline} /> : <View style={styles.underlineSpacer} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-around',
    paddingBottom: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  shellImage: {
    resizeMode: 'stretch',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    overflow: 'visible',
  },
  icon: {
    height: 27,
    width: 32,
  },
  label: {
    color: '#766F65',
    fontSize: 11.5,
    fontWeight: '800',
    marginTop: 0,
  },
  activeLabel: {
    color: '#0C73DB',
  },
  underline: {
    height: 5,
    marginTop: 2,
    width: 50,
  },
  underlineSpacer: {
    height: 8,
  },
});
