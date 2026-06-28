/**
 * Root Expo Router layout.
 *
 * This file controls the top-level navigation container for the entire app.
 * For an entry-level React Native review, this is an important file because it
 * explains why the project now uses a Stack instead of NativeTabs.
 *
 * A Stack works well here because the app has a task flow:
 *   Home -> Review Decks -> Deck Review Session
 *
 * The deck review screen should feel like a focused, full-screen mode rather
 * than another permanent tab in the app.
 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    /**
     * GestureHandlerRootView must wrap the app when gesture-handler is used.
     * Without this, swipe/pan gestures can behave inconsistently on native devices.
     */
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/*
        ThemeProvider gives React Navigation a light/dark theme.
        Most screens use custom colors right now, but keeping this provider here
        makes future navigation/UI theming easier.
      */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />

        {/*
          Expo Router maps these Stack.Screen names to files under src/app.

          index          -> src/app/index.tsx
          review/index   -> src/app/review/index.tsx
          review/[deckId] -> src/app/review/[deckId].tsx

          This replaced the old NativeTabs setup because the dynamic review route
          was not consistently reachable through the tab navigator.
        */}
        <Stack>
          {/* headerShown removes Expo Router's default title/back bar from Home. */}
          <Stack.Screen name="index" options={{ title: 'Flashcards', headerShown: false }} />

          {/* The Review index has its own visual header, so the default header is hidden. */}
          <Stack.Screen name="review/index" options={{ title: 'Review', headerShown: false }} />

          {/* Browse Decks mirrors the Review carousel without due-card filtering. */}
          <Stack.Screen name="review/browse" options={{ title: 'Browse Decks', headerShown: false }} />

          {/* Notes has its own notebook-style header and save controls. */}
          <Stack.Screen name="notes/index" options={{ title: 'Notes', headerShown: false }} />

          {/*
            The deck review session is intentionally full-screen. It has its own
            custom Back button inside the screen UI.
          */}
          <Stack.Screen
            name="review/[deckId]"
            options={{
              title: 'Deck Review',
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
