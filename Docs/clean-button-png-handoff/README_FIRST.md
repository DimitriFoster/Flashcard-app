# Folio button PNG handoff for Codex

This handoff gives Codex **exact PNG button art** for the Folio review page so it does **not** have to redraw the crayon texture, icon, border, or label.

## Goal
Replace the visible surface of two review-page buttons with the exact cleaned PNG assets:
- `back_button_transparent.png`
- `good_button_transparent.png`

## Important rule
**These assets are the source of truth.** Codex should not recreate them with SVG, text, borders, gradients, shadows, or procedural texture.

## What is included
- `assets/review-page-buttons/back_button_transparent.png`
- `assets/review-page-buttons/good_button_transparent.png`
- original source references
- current-state screenshot for context
- example sheet showing the broader design target
- docs describing exact usage rules
