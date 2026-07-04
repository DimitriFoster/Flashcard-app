# Folio review page mockup update — round 2

This update keeps the PNG-driven mockup approach and makes alignment fixes based on the latest Android screenshot.

## What changed

1. **Undo button no longer appears faded**
   - The `FolioAssetButton` disabled visual opacity was changed to `1`.
   - The undo button can still be disabled behaviorally, but the saved PNG face stays visually consistent.
   - Do not recreate this button in code.

2. **Card surface background fixed**
   - The separated animated flashcard surface now uses an opaque cream-paper PNG, not an accidentally transparent interior.
   - `card_front_surface.png` and `card_stack_back_layers.png` were rebuilt from the saved disassembled mockup assets, not regenerated.
   - The top card is still separate from the stack so it can animate independently.

3. **Card stack alignment tightened**
   - The stack is slightly larger than the interactive top card.
   - The animated top card sits over the stack with bottom/right paper layers showing underneath.

4. **Bottom navigation no longer overlays the grading buttons**
   - The bottom nav is no longer absolutely positioned over the scroll content.
   - The scroll area now ends above the bottom nav, so the grade buttons display cleanly.

5. **Deck panel text and session-flow layout tightened**
   - Long deck names are constrained with smaller type and ellipsis.
   - UI labels disable font scaling to prevent oversized labels from breaking the fixed PNG layout.
   - Session-flow tokens were tightened so they fit inside the panel cleanly.

6. **Bottom nav background fixed**
   - The nav shell now has an opaque cream-paper fill instead of a transparent center.

## Files updated

- `src/components/review/deck-review-session.tsx`
- `src/folio-review/DeckSummaryPanel.tsx`
- `src/folio-review/SessionFlowStrip.tsx`
- `src/folio-review/GradeButtonRow.tsx`
- `src/folio-review/BottomTabBar.tsx`
- `src/folio-review/FolioAssetButton.tsx`
- `assets/folio-ui/review/header/back_button.png`
- `assets/folio-ui/review/header/undo_button.png`
- `assets/folio-ui/review/header/edit_button.png`
- `assets/folio-ui/review/header/help_button.png`
- `assets/folio-ui/review/card/card_front_surface.png`
- `assets/folio-ui/review/card/card_stack_back_layers.png`
- `assets/folio-ui/review/bottom-nav/tab_bar_background.png`
- `assets/folio-ui/review/session-flow/token_new.png`

## Codex instruction

Replace the current project files with the files in this zip. Do not regenerate visual assets. The hand-drawn look comes from `assets/folio-ui/review/`. Keep React Native responsible for behavior, layout, live text, and animation.

After applying, test on the same Android device width used in the screenshot and verify:

- Undo button is visible at normal opacity.
- The prompt card has a cream paper background.
- The prompt card aligns with the stack behind it.
- Grade buttons sit above the bottom navigation.
- Session flow remains inside the deck panel.
- Header buttons stay on screen.
