# Folio Maestro Workflow

Maestro gives Folio a repeatable mobile test harness. The main goal right now is smoke testing, not strict screenshot comparison.

## Why this matters for Folio

Folio uses PNG-heavy UI surfaces. Manual testing can miss regressions like:

- a search bar drifting out of the header
- a transparent PNG being replaced by an opaque asset
- a mini-card strip clipping on narrow screens
- a route opening with no seeded deck data
- a button looking tappable but losing its press target

Maestro gives us a stable way to open the same screens with the same data after every layout change.

## Current implementation

Round 71 adds:

- `.maestro/smoke/*.yaml` flows
- `.maestro/README.md`
- `src/app/maestro-seed.tsx`
- `src/storage/maestro-fixtures.ts`
- stable `accessibilityLabel` / `testID` values on important controls
- package scripts:
  - `npm run maestro:smoke`
  - `npm run maestro:visual`

## Standard testing loop

1. Install the updated Folio build on Android.
2. Start the dev server.
3. Run:

```bash
npm run maestro:smoke
```

4. If a flow fails, save/upload:
   - the failing Maestro output
   - any screenshot Maestro captured
   - the device size/emulator profile

5. Fix one screen at a time.

## Seed route

Open this in the dev build:

```text
flashcardapp://maestro-seed
```

It resets local data to deterministic test decks. This means smoke tests should behave the same even if the app previously had imported testing decks.

## Future visual-regression pass

Only add screenshot assertions after a screen is approved. The first visual targets should be cropped or focused checks, not whole-screen checks:

- Browse Decks header/search area
- Browse session header/mini-card strip
- Review card body
- Footer controls

Whole-screen comparisons can be too noisy while card text, counts, and deck names are still changing.
