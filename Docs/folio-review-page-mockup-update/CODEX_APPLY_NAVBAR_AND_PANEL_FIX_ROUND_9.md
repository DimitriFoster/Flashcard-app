# Folio round 9: Android navbar retry + deck panel count fix

## What changed

1. Strengthened Android immersive navigation handling:
   - `src/hooks/use-android-immersive-navigation.ts` now exports `applyAndroidImmersiveNavigation()`.
   - The hook retries hiding the Android nav bar over several seconds instead of only calling once.
   - `src/folio-review/FolioReviewScreen.tsx` reapplies immersive navigation when the review screen gains focus and after layout.

2. Fixed deck title/card-count crowding:
   - The deck panel is slightly taller.
   - Deck title text is slightly smaller/tighter.
   - The due/total count line is pulled up so the divider no longer clips it.
   - The title/session section has more inner horizontal padding from the blue border.

3. Removed `package-lock.json` from this zip to avoid machine-specific/internal package registry URLs.

## Important note about Expo Go

Android navbar hiding can be unreliable in Expo Go because the app is running inside the Expo Go shell. This update uses Expo's runtime API correctly and retries it, but the most reliable test is a development build or installed APK.

Recommended after applying:

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npx expo start -c
```

If Expo Go still shows the Android navbar, test with a dev build:

```powershell
npx expo run:android
```

or create/install an Android development build through EAS.
