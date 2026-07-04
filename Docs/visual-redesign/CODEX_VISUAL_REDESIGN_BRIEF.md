# Folio Visual Redesign — Codex Handoff

## Goal

Redesign Folio’s spaced repetition card view and browse-card view around the new cozy paper-and-crayon visual system.

The target look is shown in:

```txt
docs/visual-redesign/references/review_card_view_reference.png
docs/visual-redesign/references/browse_card_view_reference.png
docs/visual-redesign/references/review_page_template_reference.png
docs/visual-redesign/references/browse_decks_template_reference.png
docs/visual-redesign/references/folio_icon_reference.png
```

## Visual direction

The app is now named **Folio**.

The design direction is:

```txt
cream paper background
soft pastel crayon texture
rounded paper/card panels
blue accents for review/browse/system UI
yellow/orange for Again/back/new-note warmth
coral/red for Hard/danger
soft blue for Good/review
soft green for Easy/edit/success
hand-drawn-feeling icons and markings
clear, friendly explanatory UI
```

## Current patch scope

This zip changes the **deck card view component** used by both:

```txt
src/app/review/[deckId].tsx
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
```

This is intentionally the inner card-view layer first. The broader `/review`, `/review/browse`, and home page redesign can come next.

## Implemented in this patch

### Spaced repetition card view

The due-review card view now moves toward the Folio mockup:

```txt
- Folio title centered at top
- crayon-colored back button
- Undo button preserved
- Edit button preserved
- blue cartoon question-mark help button
- blue-accent deck header panel
- session-flow strip with tiny card markers
- large stacked flashcard surface
- four pastel difficulty buttons:
  Again, Hard, Good, Easy
```

### Browse-card view

The same component now has a browse-mode layout when scheduling buttons are hidden:

```txt
- same Folio top toolbar
- same crayon back / undo / edit / help controls
- deck header says browse mode does not change scheduling
- browse-flow strip shows card position / search context
- same large stacked flashcard surface
- Previous / Flip card / Next controls instead of difficulty buttons
- note stating browse mode keeps the schedule unchanged
```

## Important behavioral note

This patch preserves the existing scheduling behavior.

The session-flow strip is currently a **visual/explanatory UI layer**, not yet a fully accurate animated queue. It is meant to establish the design and layout first.

Future Codex task:

```txt
Wire session-flow markers to real review queue state:
- new cards
- due cards
- learning cards
- last selected grade
- cards returning later in the current session
- cards completed for today
```

## Keep these controls

The user specifically wants to keep:

```txt
- Edit button
- Undo button
- crayon-colored back button
- blue question-mark help/tutorial button
```

Do not remove these when iterating.

## Next likely tasks

After this patch is tested visually:

```txt
1. Polish the review-card page spacing on real Android device.
2. Rebuild /review index page using the same Folio template.
3. Rebuild /review/browse page using the same Folio template.
4. Add tutorial modal/image opened by the question-mark help button.
5. Add recipe-based context-aware deck icons.
6. Wire session-flow card markers to actual scheduling state.
```

## Context-aware deck icon direction

Do not use live image generation inside the app yet.

Use recipe-based icons:

```txt
deck title + card text -> topic detector -> saved icon recipe -> assembled SVG/PNG icon
```

Examples:

```txt
AI / systems -> blue brain/circuit doodle
Spanish/language -> speech bubble / greeting mark
Python/programming -> snake-like code doodle
General -> stacked paper/cards icon
```

This should be cheap, cached, and editable by the user.
