# Folio review button image-skin handoff

This handoff is for **one narrow task only**: replace the **visible button art** on the **review / browse deck page** with the exact packaged PNGs in `assets/review-page-buttons/`.

## What Codex should do
- Keep the existing button logic and event handlers.
- Keep the existing page structure.
- Replace the current button face rendering with these packaged art assets.
- Use the button PNGs as the **visual skin** for the buttons.
- Do **not** redraw these buttons with RN borders, gradients, SVG line art, or recreated text.

## What Codex should NOT do
- Do not remake the button faces from scratch.
- Do not overlay new text labels on top of the PNGs.
- Do not crop the PNGs to quarter corners or partial slices.
- Do not tile the PNGs.
- Do not change the button copy shown inside the art assets.
- Do not redesign the page layout in this task.

## Asset scope in this zip
Included button skins:
- Back
- Undo
- Edit
- Help
- Again
- Hard
- Good
- Easy

## Main idea
For this task, the PNG itself is the visible button face. The React Native button is just the interactive wrapper.

Use a `Pressable` (or existing button component) wrapped around an `ImageBackground` or `Image` that fills the button shell.

## Start with these docs
1. `docs/CODEX_INTEGRATION_INSTRUCTIONS.md`
2. `docs/REVIEW_BUTTON_LAYOUT_AND_BEHAVIOR_SPEC.md`
3. `docs/ASSET_MANIFEST.json`
4. `snippets/REVIEW_BUTTON_IMAGE_SKIN_EXAMPLE.tsx`
