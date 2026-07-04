# Round 8 — Hide Android navigation bar

## Goal
Remove the persistent Android navigation bar from the bottom of the Folio review screen so the app's own bottom navigation has more visual room.

## Files changed
- `package.json`
- `package-lock.json`
- `app.json`
- `src/app/_layout.tsx`
- `src/hooks/use-android-immersive-navigation.ts`

## What changed
1. Added `expo-navigation-bar` as an Expo SDK 55-compatible dependency.
2. Added a reusable hook: `useAndroidImmersiveNavigation()`.
3. Called that hook from the root Expo Router layout so the Android nav bar hides while the app is active.
4. Updated `app.json` with `androidNavigationBar.visible = "sticky-immersive"` for Android builds.

## Expected behavior
- The Android nav bar should hide after the app starts.
- A system edge swipe can temporarily reveal it.
- When the app returns from background, the hook reapplies hidden immersive mode.

## Important install step
After applying this zip, run:

```bash
npm install
npx expo start -c
```

If using a dev build instead of Expo Go, rebuild after installing the dependency:

```bash
npx expo run:android
```

## Notes
This pass does not alter the PNG mockup assets or the review-page layout. It only changes Android system navigation behavior.
