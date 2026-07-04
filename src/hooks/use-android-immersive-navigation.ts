import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

const PAPER_BACKGROUND = '#FFF8EA';
const RETRY_DELAYS_MS = [0, 80, 200, 500, 1000, 1800, 3000, 5000];

/**
 * Best-effort Android immersive navigation.
 *
 * Expo Go can be stubborn because the app is running inside the Expo Go shell.
 * This function is still useful there, but the most reliable test is a dev build
 * or an installed APK created from this project.
 */
export async function applyAndroidImmersiveNavigation() {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Draw the app behind the navigation area instead of reserving a permanent
    // white system strip at the bottom.
    await NavigationBar.setPositionAsync('absolute');

    // When Android briefly reveals the bar, keep it visually aligned with the
    // Folio paper background instead of harsh black/white contrast.
    await NavigationBar.setBackgroundColorAsync(PAPER_BACKGROUND);
    await NavigationBar.setButtonStyleAsync('dark');

    // overlay-swipe means the bar should only appear temporarily after the user
    // swipes from the bottom edge.
    await NavigationBar.setBehaviorAsync('overlay-swipe');
    await NavigationBar.setVisibilityAsync('hidden');
  } catch (error) {
    console.warn('[Folio] Unable to hide Android navigation bar:', error);
  }
}

function scheduleImmersiveRetries() {
  const timers = RETRY_DELAYS_MS.map((delay) =>
    setTimeout(() => {
      void applyAndroidImmersiveNavigation();
    }, delay),
  );

  return () => {
    timers.forEach(clearTimeout);
  };
}

export function useAndroidImmersiveNavigation() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    let clearRetries = scheduleImmersiveRetries();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        clearRetries();
        clearRetries = scheduleImmersiveRetries();
      }
    });

    return () => {
      clearRetries();
      subscription.remove();
    };
  }, []);
}
