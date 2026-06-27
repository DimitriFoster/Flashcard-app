# Warm/snappy UI replacement files

These files are meant to be copied into your existing Flashcard-app repo locally, then reviewed in Expo.

## How to apply

1. Unzip this folder.
2. Copy the `src` folder over your repo's existing `src` folder.
3. From your repo root, run:

```bash
npx expo start --clear
```

## Files included

- `src/constants/design.ts` — new shared design tokens for colors, radius, spacing, shadows, and animation timing.
- `src/app/index.tsx` — home screen now uses shared warmer tokens.
- `src/components/home/create-section.tsx` — shorter labels, faster dropdown animation, selected deck row, card-added feedback.
- `src/components/home/create-section.styles.ts` — warmer paper palette, larger radii, softer shadows, press scaling.
- `src/components/home/review-section.tsx` — warmer shared styling and press scaling.
- `src/app/review/index.tsx` — review index uses shared tokens.
- `src/components/review/preview-panel.tsx` — warmer preview cards, larger radius, soft depth.
- `src/components/review/deck-review-session.tsx` — physical card-stack feel and grading sublabels.
- `src/components/review/deck-review-session.styles.ts` — warmer full-screen review mode, stacked cards, thumb-friendly buttons.

## Notes

No GitHub commits were made by ChatGPT. Apply these locally and commit from your own machine when you are happy with the Expo review.
