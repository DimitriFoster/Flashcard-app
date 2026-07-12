/**
 * Dev-only test seeding route for Maestro.
 *
 * Open with: flashcardapp://maestro-seed
 * This route resets local Folio data to deterministic fixture decks/cards so
 * automated tests can run from a known state. In production builds the seed
 * action is unavailable.
 */
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, RADIUS, SHADOWS } from '@/constants/design';
import { seedMaestroFixtureData } from '@/storage/maestro-fixtures';

declare const __DEV__: boolean;

export default function MaestroSeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [status, setStatus] = useState('Preparing Maestro test data…');

  useEffect(() => {
    if (!__DEV__) {
      setStatus('Maestro test data is available in development builds only.');
      return;
    }

    const result = seedMaestroFixtureData();
    setStatus(result ? 'Maestro test data ready' : 'Maestro test data failed');
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Folio test harness</Text>
        <Text accessibilityRole="header" style={styles.title}>{status}</Text>
        <Text style={styles.body}>
          This development-only route seeds a small, predictable set of decks so Maestro flows do not depend on whatever is stored on the test phone.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Browse Decks"
          testID="maestro-open-browse-decks"
          onPress={() => router.replace('/review/browse')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>Open Browse Decks</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Review Due Cards"
          testID="maestro-open-review-due-cards"
          onPress={() => router.replace('/review')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonText}>Open Review Due Cards</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF8EA',
    borderColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    gap: 14,
    maxWidth: 430,
    padding: 22,
    width: '100%',
    ...SHADOWS.card,
  },
  eyebrow: {
    color: COLORS.reviewDeep,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 33,
  },
  body: {
    color: '#4F4740',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.md,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.reviewCrayon,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: COLORS.reviewDeep,
    fontSize: 17,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
