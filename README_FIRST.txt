FOLIO — BATCH 1 ICON RESIZER
================================

This utility resizes only the seven oversized PNGs identified in Batch 1:

1. assets\folio-ui\home-page\home_review_icon.png
2. assets\folio-ui\home-page\home_notes_icon.png
3. assets\folio-ui\home-page\home_arrow_icon.png
4. assets\folio-ui\home-page\create-card\create_card_deck_stack.png
5. assets\folio-ui\home-page\create-card\create_card_front_a.png
6. assets\folio-ui\home-page\create-card\create_card_back_b.png
7. assets\folio-ui\home-page\create-card\create_card_add_stack.png

WHAT IT DOES
------------

- Preserves each PNG's full canvas and aspect ratio.
- Does not crop or alter the app's rendered layout.
- Writes 32-bit transparent PNG output.
- Uses high-quality bicubic downsampling.
- Creates a timestamped backup before replacing anything.
- Verifies each output file after saving.
- Produces a JSON report inside the backup folder.

HOW TO RUN IT
-------------

1. Extract this ZIP directly into the current Folio project root.
   The project root is the folder containing package.json and the assets folder.

2. Double-click:

   RUN_BATCH1_RESIZE.cmd

3. After it completes, clear Metro's image cache:

   npx expo start -c

4. Check:
   - Home review panel icon
   - Home notes panel icon
   - Home panel arrows
   - Create a Card panel's Deck, Front, Back, and Add icons

BACKUP AND RESTORE
------------------

Backups are stored under:

.folio-backups\batch1-icon-resize-YYYYMMDD-HHMMSS\

To undo the resize, double-click:

RESTORE_LATEST_BATCH1_BACKUP.cmd

No TypeScript or TSX files are changed.
No npm package is required.
The utility uses Windows' built-in System.Drawing support.


VERSION 2 FIX
-------------

This version replaces the resized PNG atomically with System.IO.File.Replace.
It fixes the Windows error:

Move-Item : Cannot create a file when that file already exists.

It is safe to rerun. A new timestamped backup is created each time.


VERSION 3 FIX
-------------

This version uses System.IO.File.Copy(..., overwrite=true), followed by
deleting the verified temporary PNG.

It fixes both earlier Windows errors:
- Move-Item could not overwrite an existing file.
- File.Replace rejected the null backup-path argument.

The script is safe to rerun and creates a fresh backup first.
