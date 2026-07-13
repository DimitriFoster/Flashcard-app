# Batch 1 Icon Resize Report

Date: 2026-07-13

## Scope

This conservative pass processed only the seven requested PNG files. Each image was resized to fit its target bounds while preserving the complete transparent canvas and aspect ratio. No crop or enlargement was performed.

Processing used Pillow 12.2.0 with RGBA output and Lanczos downsampling. Temporary outputs were reopened and validated before replacing the originals.

Backup: `.folio-backups/batch1-codex-20260713-065235/` (exactly seven original PNGs, preserving their relative paths)

## Verification

| File | Original dimensions | New dimensions | Original file size | New file size | Reduction | Original mode | Final mode | Alpha remains | Validation |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| `assets/folio-ui/home-page/home_review_icon.png` | 1176 x 1176 | 192 x 192 | 796,940 bytes | 55,583 bytes | 93.03% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/home_notes_icon.png` | 1046 x 1046 | 192 x 192 | 381,383 bytes | 32,985 bytes | 91.35% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/home_arrow_icon.png` | 972 x 972 | 96 x 96 | 287,768 bytes | 6,379 bytes | 97.78% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/create-card/create_card_deck_stack.png` | 668 x 713 | 120 x 128 | 459,604 bytes | 16,913 bytes | 96.32% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/create-card/create_card_front_a.png` | 703 x 702 | 128 x 128 | 514,364 bytes | 18,947 bytes | 96.32% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/create-card/create_card_back_b.png` | 617 x 604 | 128 x 125 | 430,248 bytes | 20,106 bytes | 95.33% | RGBA | RGBA | Yes | Passed |
| `assets/folio-ui/home-page/create-card/create_card_add_stack.png` | 793 x 607 | 128 x 98 | 446,783 bytes | 12,364 bytes | 97.23% | RGBA | RGBA | Yes | Passed |

## Validation Summary

- All 7 outputs reopened successfully after replacement.
- All outputs are PNG files with RGBA color mode.
- All outputs retain an alpha channel with alpha extrema `0..255`.
- All outputs fit within their requested target dimensions.
- No image was enlarged or cropped.
- Validation failures: none.
- No TypeScript, TSX, layout, style, import, filename, or path changes were made by this pass.

## Worktree Checks

`git status --short` and `git diff --stat` were run after the replacement. Existing user changes remain present; the only image paths changed by this pass are the seven listed above. The backup directory is under `.folio-backups/`; this repository's current `.gitignore` does not ignore that directory, so it may appear as an existing untracked folder in Git status.
