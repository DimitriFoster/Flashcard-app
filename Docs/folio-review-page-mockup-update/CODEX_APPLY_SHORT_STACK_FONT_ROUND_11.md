# Round 11 — Short Stack font preview

## Goal
Preview Short Stack as the handwritten app font for the Folio review page text.

## What changed
- Added `@expo-google-fonts/short-stack` to `package.json`.
- Added `src/folio-review/folioFonts.ts` with the shared `FOLIO_HAND_FONT` constant.
- Loaded `ShortStack_400Regular` in `src/app/_layout.tsx` before rendering the app.
- Applied Short Stack to:
  - review card prompt/answer text
  - “Tap to reveal answer” text
  - deck title and subtitle in the review panel
  - “Session flow” and legend labels

## Important
This update uses the npm package for the font. It does not add a raw `.ttf` font file to the repo.

## After applying
Run:

```powershell
npm install
npx expo start --dev-client -c
```

Because the app now uses the dev client for Android immersive navigation, preview this in the Folio development build rather than Expo Go.
