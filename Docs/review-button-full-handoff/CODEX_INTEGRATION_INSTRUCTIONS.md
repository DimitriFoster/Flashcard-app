# CODEX integration instructions

## Goal
Apply the packaged Folio PNG button art to the **review deck page** and **browse card page** buttons **without recreating the art**.

## Non-negotiable rule
The PNG assets in `assets/review-page-buttons/` are the source of truth for the visible button face.

Codex must **use those exact files directly**.

## Asset-to-button mapping

### Header row
- `back_button.png` -> back / leave review page button
- `undo_button.png` -> undo last answer button
- `edit_button.png` -> edit current card button
- `help_button.png` -> tutorial / help modal button

### Difficulty row
- `again_button.png` -> Again button
- `hard_button.png` -> Hard button
- `good_button.png` -> Good button
- `easy_button.png` -> Easy button

## How to render them
Use one of these two approaches:

### Preferred approach
- `Pressable` as the interactive wrapper
- `ImageBackground` as the full-face art layer
- no extra text children
- accessibility label should come from the wrapper, not from added visible text

### Acceptable fallback
- `Pressable`
- child `Image` filling the shell

## Required implementation behavior
1. Keep existing `onPress` / navigation / undo / edit / grading behavior.
2. Keep existing state management.
3. Replace only the visible button-face rendering.
4. Keep the current page colors and layout around the buttons.
5. Do not re-type the button labels as React Native `Text` layered on top.
6. Do not crop or clip the art into corners.
7. Do not treat the PNG as a tiny icon placed in the corner of a generic button.
8. The entire PNG is the button face.

## Why this method
Previous iterations failed because the art was being partially recreated, partially overlaid, or reduced to corner image fragments. This task avoids that by making the button art a direct asset-driven skin.

## Press feel requirement
The button press should feel **solid, snappy, and intentional**.

Recommended press treatment:
- on press in: scale to `0.97`
- slight `translateY: 1` to make the button feel grounded
- reduce shadow slightly while pressed
- return quickly on release
- no mushy long easing
- avoid large bounce

If using `Animated`:
- spring with high stiffness / moderate damping
- fast settle, subtle motion only

If using `Pressable` style callback only:
- `transform: [{ scale: pressed ? 0.97 : 1 }, { translateY: pressed ? 1 : 0 }]`
- optionally slightly lower opacity only if the art still reads clearly

## Suggested file targets
Codex should look for the current review page button rendering in the review-session screen, likely in files similar to:
- `src/components/review/deck-review-session.tsx`
- `src/components/review/deck-review-session.styles.ts`

If exact paths differ, apply the same integration pattern to the actual review page component.

## Important limitation for this task
Do **not** solve unrelated layout or safe-area problems in the same patch unless required for the button art to render at all.

This handoff is specifically about **using the packaged PNG art correctly**.
