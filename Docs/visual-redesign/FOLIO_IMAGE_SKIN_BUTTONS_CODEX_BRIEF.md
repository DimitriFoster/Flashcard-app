# Folio Image-Skin Buttons - Codex Brief

## Goal

Replace the review deck page buttons with a more maintainable version of the hand-drawn button mockups.

Do not use full PNG buttons with baked-in text/icons.

Use this structure instead:

```txt
Pressable shell
  Animated.View for press animation
    clipped button face
      PNG button skin background
      real SVG icon centered on top
      real Text label/hint on top
```

This preserves:

```txt
- real button callbacks
- real accessibility labels
- real text labels
- real SVG icons
- flexible sizing
- disabled states
- snappy press animation
```

## Files included

```txt
src/components/folio/buttons/FolioImageSkinButton.tsx
src/components/folio/buttons/FolioReviewButtonSet.tsx
src/components/folio/buttons/index.ts
assets/images/review-button-skins/*.png
Docs/visual-redesign/CODEX_PROMPT_IMAGE_SKIN_REVIEW_BUTTONS.md
```

## Button skins

The PNG assets are background skins only. They intentionally do not contain labels or icons.

```txt
toolbar-back-yellow.png
toolbar-undo-lavender.png
toolbar-edit-green.png
toolbar-help-blue.png
grade-again-yellow.png
grade-hard-red.png
grade-good-blue.png
grade-easy-green.png
```

The page should overlay real SVG icons and real Text on top.

## Integration target

Start only with:

```txt
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
```

Do not redesign the review page. Do not edit Notes. Do not edit Home.

## Required dependency

This expects the earlier SVG icon system to be present:

```txt
src/components/folio/icons/FolioSvgIcon.tsx
```

The project must already have:

```txt
react-native-svg
```

The user already installed it with:

```powershell
npx expo install react-native-svg
```

## Exact integration

In `deck-review-session.tsx`, import:

```tsx
import {
  FolioImageSkinButton,
  FolioReviewGradeButtonRow,
} from '@/components/folio/buttons';
```

Or use `FolioReviewToolbarButtons` if it fits cleanly.

### Top bar

Replace the existing back button with:

```tsx
<FolioImageSkinButton
  accessibilityLabel="Go back"
  backgroundSource={require('../../../assets/images/review-button-skins/toolbar-back-yellow.png')}
  iconName="back"
  iconColor="#2E281F"
  iconSize={32}
  onPress={onBack}
  shellStyle={styles.backButton}
/>
```

Replace Undo/Edit/Help similarly.

### Grade row

Replace the current Again/Hard/Good/Easy row with:

```tsx
<FolioReviewGradeButtonRow onGrade={onGrade} />
```

If landscape sizing needs special handling, keep the existing row wrapper and render individual `FolioImageSkinButton` instances.

## Press animation

The included `FolioImageSkinButton` has:

```txt
spring speed: 34
press scale: 0.965
press translateY: 2
release bounciness: 7
```

This is meant to feel solid and snappy, not floaty.

## Color rules

Keep the existing Folio color language:

```txt
Back / Again: warm orange
Undo: lavender purple
Edit / Easy: green
Help / Good: blue
Hard: coral red
```

## Do not do

```txt
- Do not use full PNGs with baked-in text.
- Do not use emoji.
- Do not use placeholder letters like R, U, OK, !, or *.
- Do not change scheduling behavior.
- Do not change browse/review logic.
- Do not refactor the whole app.
```

## Acceptance checklist

```txt
[ ] Back button uses yellow skin + real SVG icon.
[ ] Undo button uses lavender skin + real SVG icon + real Text.
[ ] Edit button uses green skin + real SVG icon + real Text.
[ ] Help button uses blue skin + real SVG icon.
[ ] Grade buttons use skins + real SVG icons + real Text/hints.
[ ] Pressing buttons has a quick solid depression/release.
[ ] Existing callbacks still work.
[ ] Review page does not overlap Android nav bar.
```
