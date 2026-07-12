# Project Log

## Round 46 — Home page closed create-panel mockup recreation
- Reworked the Home screen header to match the mockup more closely, including the stacked-cards hero illustration.
- Added transparent home-page icon assets for the hero, create panel, review panel, notes panel, and action arrow.
- Redesigned the closed Create panel to use the saved transparent icon, mockup-style row layout, and crayon-fill background treatment.
- Redesigned the closed Review and Notes panels to match the same mockup language with the saved transparent icons and tinted arrow treatment.
- Kept the existing Create panel expansion behavior intact so the closed state stays locked in visually while still opening the current create workflow.

- Round 47: refined home page closed category panels to better match the mockup, swapped panel fills to precisely cropped swatch images, and tightened panel sizing/radius/padding for create/review/notes.

- Round 48: enlarged the closed Create / Review / Notes panels so the three equal-sized category panels occupy much more of the lower screen, with matched heights and scaled internal spacing/icons.

- Round 49: adjusted the Home header so the bold headline and sub-header each hold to three deliberate lines, enlarged the deck-stack hero icon, and vertically centered it against the combined text block.

- Round 50: replaced Home page hero/action icons with cleaned RGBA transparent versions generated from the latest icon set.

- Round 51: generated true-transparent green open-create icon assets from the latest icon sheet, replaced the create-panel swatch with the saved green texture, and rebuilt the Home Create panel so it opens by default into the mockup-style deck-creation layout with closed option toggles.

- Round 51b: fixed missing create_caret_down.png asset that caused Metro UnableToResolveError on the open Create panel.

- Round 51c: removed duplicate src/app/_layout.js route file that conflicted with src/app/_layout.tsx in Expo Router.

- Round 52: added the open Import deck dropdown state on the Home Create panel, copied in the true-transparent import icon set including the large center file-box illustration, and built the mockup-style dashed drop zone, supported-files row, import button, and help link.

- Round 53: added the open Pick deck dropdown state under Home Create, using the shared deck-topic detector icon set from Browse Decks, generated true-transparent selected/unselected radio assets, replaced the blank caret with the working green caret asset, and set Pick deck as the default open create panel for this pass.

- Round 54: restored the default open Create panel as the initial expanded state and kept the Import deck and Pick deck option cards wired to their new open dropdown panels.

- Round 55: changed the Import deck and Pick deck open-panel header caret behavior so tapping their header/caret returns to the default open Create panel instead of collapsing the whole Create section.

- Round 56: cleaned the New deck option icon transparency to remove the rectangular artifact and reduced the Pick deck 'Use selected deck' button text size.

- Round 57: compacted the open Create panel family so the New deck, Import deck, and Pick deck dropdown states use smaller headers, cards, rows, buttons, icons, and vertical spacing to fit more of the panel on screen.

- Round 58: changed the Home Create panel to start closed by default when opening the home page.

- Round 59: tightened the Notes screen header after removing Expo Go tools: moved Back home and Save note controls upward into the corners, changed the header to a one-line Quick Notebook title, and switched the Save note button fill to the saved notes-section crayon swatch.

- Round 60: applied Notes-screen follow-up items from the in-app note: added a small editor toolbar with bullet and checkbox insertion/toggle, made typed text push the editor upward again, reduced the right-side editor padding, tightened the header area, enlarged/squared review difficulty buttons, and removed the bottom tab bar from both browse and spaced-repetition open session pages. Also removed duplicate JS route/component files with TS/TSX counterparts so Metro does not pick stale files.

- Round 61: removed the Notes editor toolbar buttons for bullet insertion and checkbox toggling while keeping the tightened Quick Notebook layout.

- Round 64: added a default Create a Card section to the Home Create panel using the new transparent green icons. The default open Create panel now creates individual flashcards, New deck opens a separate deck-setup toggle, and Import deck is wired to the existing paste-based CSV/TSV/TXT parser/import flow.

- Round 65: restored direct phone file import for the Import deck panel using Expo DocumentPicker/FileSystem for CSV/TSV/TXT/JSON/Folio backup files, replaced the Browse Decks fake baked search bar with a live React Native search field over the same panel area, and fixed preview-card row presses so they open the specific selected card via an initialCardId route param.

- Round 66: replaced the Browse Decks hero panel and browse-session Previous, Next, and note-bar assets with newly cropped true-transparent PNGs, then updated the active and legacy browse asset imports to point at the corrected files.

## 2026-07-05 — Round 67 browse header fit tweak

- Shrank the Browse Decks search input overlay so it sits cleaner inside the hero header panel without crowding the subtitle.
- Reduced the browse-session mini colored flow cards in the matches strip so the header copy and card markers fit more neatly side by side.
- No review scheduling, navigation, card data, or browse logic changed.


## 2026-07-05 — Round 68 browse mini-flow alignment

- Shifted the browse-session colored mini-card flow markers down by 7px inside the matches strip so they sit lower and cleaner beside the header copy.
- No review scheduling, navigation, card data, or browse logic changed.

## Round 69 — Browse search bar 20% smaller

- Reduced the Browse Decks hero search bar by about 20% so it sits more neatly inside the header art.
- Adjusted the search bar height, width, radius, border weight, icon size, and placeholder font size together to keep the proportions consistent.
- Left the Round 68 browse-session mini-card placement unchanged.


## Round 70 — Responsive mobile + AI design education pass

- Added `Docs/responsive-mobile-ai-playbook.md` as a repository reference for future Folio responsive-design work.
- Captured Expo/React Native safe-area, window-dimension, ScrollView, image-scaling, adaptive-breakpoint, touch-target, visual-regression, and AI-assisted UI workflow guidance.
- Added Folio-specific acceptance criteria and a target device screenshot matrix for future responsive passes.
- No app runtime code or assets changed.

## Round 71 — Maestro testability and repeatable seed data

- Added `.maestro/smoke/` flows for the seed route, Browse Decks, browse session, Review Due Cards, and due review session.
- Added `.maestro/README.md` and `Docs/maestro-workflow.md` to document the local testing workflow.
- Added a development-only `src/app/maestro-seed.tsx` route available through `flashcardapp://maestro-seed`.
- Added deterministic fixture decks/cards in `src/storage/maestro-fixtures.ts` so tests do not depend on imported local phone data.
- Added stable `accessibilityLabel` and `testID` values to key controls that Maestro needs to tap or assert.
- Added `npm run maestro:smoke` and `npm run maestro:visual` package scripts.
- Left visual-regression assertions as placeholders until each screen is visually approved.

## Round 72 — Compact Review Due Cards layout

- Added a compact layout branch for the Review Due Cards landing page when width is under 370px or safe height is under 720px.
- Reduced the spaced-repetition note, Create/Browse/Stats buttons, deck badge, and review-deck preview card by about 20% on compact screens.
- Removed the non-scrollable minimum-height trap on compact review screens by using actual safe height and allowing vertical scroll only when the compact branch is active.
- Kept review/deck scheduling logic unchanged.


## Round 73 — Browse Decks compact header and preview-fit pass

- Shrank and repositioned the Browse Decks top-right Review Due Cards link on narrow screens so it no longer clips across the centered Folio wordmark.
- Made the Browse Decks hero search bar derive its width, height, font size, icon size, and right/bottom placement from the hero panel size instead of fixed percentages.
- Shortened the small-screen search placeholder to "Search..." so it does not collide with the hero panel text.
- Added preview-aware deck carousel fitting: when the Preview Cards panel opens on short/narrow phones, the deck carousel and card contents scale down to preserve vertical space.
- Reduced the expanded preview panel height on short screens while keeping its internal card list scrollable.
- Kept Browse Decks selection/search/open-deck logic unchanged.

## Round 74 — Hide native Stats header
- Added `review/stats` to the Expo Router Stack with `headerShown: false`.
- Keeps the existing Folio-styled Back button on the Stats page while removing the default native navigation bar that appeared above it.
- No stats calculations, review scheduling, or storage logic changed.

## Round 75 — Compact guide close button
- Updated the Folio guide/help modal close control so small screens use a simple circular × button instead of the wider Close pill.
- Applied the compact close behavior to the current review/browse session guide and the older shared Folio tutorial modal for consistency.
- Kept modal content, help behavior, and review/browse logic unchanged.
- Round 76: stabilized the Notes notebook editor while typing by snapping measured TextInput content height to notebook line-height increments, removing forced animated scroll-to-end on every character, and using non-animated caret-preservation scrolls during keyboard editing.

## Round 77 — Scrollable Pick Deck dropdown
- Removed the four-deck cap from the Home page Pick deck dropdown.
- Wrapped the available deck list in a nested vertical ScrollView with a capped height so all imported/created decks can be reached without pushing the Use selected deck button off the panel.
- Added stable select-deck accessibility labels to the pick rows.
- Kept deck selection, create-card, import, and storage behavior unchanged.

## Round 78 — Compact spaced-repetition session fit
- Added compact scaling for the spaced-repetition review session on narrow/short phones.
- Reduced the DeckSummaryPanel header graphic, session-flow strip, and card stack/card surface height on small screens so the difficulty buttons remain visible.
- Made the GradeButtonRow accept the same compact scale so the button row stays proportional without changing review grading behavior.
- Kept browse-mode card navigation, review scheduling, and storage logic unchanged.

## Round 79 — Browse search single-result swipe fix
- Fixed a browse-session edge case where filtered searches with only one matching card, such as searching `hook`, could appear to break after swiping the first card.
- Single-card browse result swipes now spring the card back into place instead of animating it offscreen with no replacement card to render.
- Kept multi-card swipe navigation, search filtering, review grading, and spaced-repetition scheduling behavior unchanged.
- Round 80: hardened Browse Decks preview-card deep linking by passing both the selected card id and preview-list index into the review route, then resolving by id first with an index fallback. This keeps preview-row taps opening the intended card without changing search filtering, review scheduling, or swipe behavior.

## Round 81 — Review session responsive breakpoints
- Replaced the overly aggressive medium-phone spaced-repetition compaction from Round 78 with named review-session breakpoints: tiny, small, medium, and large/default.
- Kept true compact behavior only for genuinely narrow/short screens while restoring full-scale header graphics and larger flashcard proportions on medium and large phones.
- Increased the review flashcard height targets for medium and large phones so the card surface keeps its polished mockup proportions instead of looking squished.
- Scaled the flashcard inner padding, star, progress text, question/answer text, underline, illustration, and hint only when the screen is actually tiny/small.
- Kept GradeButtonRow, review scheduling, browse-mode behavior, storage, and card navigation logic unchanged.

## Round 82 — Session-flow placement animation
- Added a post-grade session-flow animation to the top spaced-repetition header.
- Before grading, the active card marker remains neutral so the strip does not reveal the difficulty color early.
- After a grade, the matching legend bucket highlights and a crayon token glides to a rough placement bucket: Again/Hard sooner, Good later, Easy farther.
- The grade callback is delayed briefly so the user can see where the current card is being placed before the next card appears.
- Kept review scheduling, storage, browse-mode behavior, and card rendering logic unchanged.

## Round 83 — Grouped session-flow buckets
- Reworked the spaced-repetition session-flow strip so the tiny card markers read as a left-to-right time map instead of a mixed decorative rainbow.
- Grouped markers into clear zones: Now, New, Soon, Later, and Far, with Again/Hard in the Soon zone, Good in Later, and Easy in Far.
- Updated the post-grade placement animation to move the current neutral marker directly into the appropriate zone bucket instead of using relative offsets.
- Kept the no-spoiler behavior before grading: the current card remains neutral until the user chooses a difficulty.
- Kept review scheduling, storage, browse-mode behavior, and card rendering logic unchanged.

## Round 84 — Session-flow label padding
- Added bottom breathing room to the grouped session-flow strip so the bucket/legend text no longer sits against the lower panel edge on small screens.
- Slightly increased the deck summary shell height and flow-section bottom padding while leaving the review queue, grading, scheduling, and animation logic unchanged.


## Round 85 — Spaced-repetition flip animation
- Added the same animated Y-axis flip treatment used by Browse Decks cards to the spaced-repetition review-session flashcards.
- The prompt and answer are now rendered as separate front/back card faces with backface visibility, so tapping the card flips between them instead of instantly swapping text.
- Preserved the existing swipe translation/rotation, responsive card sizing, review grading, session-flow placement animation, and scheduling/storage behavior.

## Round 86 — Beginner spaced-repetition help guide
- Replaced the Folio help/tutorial image with a beginner-friendly spaced repetition introduction.
- Added a short explanation, a four-step review diagram, benefit callouts, and a simple spaced-gap/grade-bucket diagram showing why harder cards return sooner and easier cards wait longer.
- Updated tutorial modal labels from “Folio guide / How review flow works” to “Beginner guide / Spaced repetition basics.”
- Kept review scheduling, card flipping, storage, browsing, and grading behavior unchanged.

- Round 87: restyled the spaced repetition help guide to match Folio's softer paper UI, removed the strong blue panel outlines, increased guide text sizing, and set the "Spaced repetition basics" modal title in the same Folio hand-drawn header font.

- Round 88: simplified the spaced repetition help guide by removing the diagram-style visuals, keeping the warm Folio paper styling, adding a short beginner explanation, and adding a Try at Home section for practicing with traditional paper flashcards.
