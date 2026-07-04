# BUTTON_SPEC_REVIEW_PAGE.md

## 1) Back button
Asset: `assets/review-page-buttons/back_button_transparent.png`

### Placement
- Keep the back button in the current top-left position of the review / browse page header.
- Do not move the Folio title.
- Center the button vertically in the header row.

### Sizing
- Visual size target: `76dp x 76dp`
- Touch target: at least `88dp x 88dp`
- Wrapper should allow the full visual shadow to render.

### Rendering
- `resizeMode: 'contain'`
- transparent wrapper background
- no extra background color
- no runtime border
- no runtime shadow
- no icon overlay

### Behavior
- Existing back navigation logic stays unchanged.
- Press animation should feel firm and quick.

## 2) Good difficulty button
Asset: `assets/review-page-buttons/good_button_transparent.png`

### Placement
- Replace the current visible art for the `Good` grading button at the bottom of the review page.
- Keep the current grading behavior / scheduling logic unchanged.
- Keep the row layout intact so the Good button still aligns with the other grade buttons.

### Sizing
- Visual size target: `98dp x 138dp`
- Touch target: at least `106dp x 146dp`
- Maintain aspect ratio.

### Rendering
- `resizeMode: 'contain'`
- transparent wrapper background
- no runtime border
- no runtime shadow
- no SVG smile overlay
- no separate `Text` nodes for `Good` or `15 min`

### Behavior
- Existing onPress grading action stays unchanged.
- Keep the same accessibility role and label.
- Press feedback should be tactile and immediate.

## Why this method is being used
The crayon fill texture, hand-drawn icon, and label spacing have been drifting when recreated in code. For this phase, the mockup art itself is the most reliable source of truth.
