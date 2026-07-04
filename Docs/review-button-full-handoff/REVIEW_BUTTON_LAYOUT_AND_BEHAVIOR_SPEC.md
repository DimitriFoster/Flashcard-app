# Review button layout and behavior spec

## Design philosophy
Folio should feel like a real study tool with warm, tactile, hand-drawn surfaces. In this task, the visible button face should look like it came directly from the approved mockup.

The PNG assets already contain:
- the color fill
- the crayon texture
- the hand-drawn outline
- the icon / text composition

React Native should provide:
- interaction
- placement
- shadow
- layout
- accessibility

## Top header row
Buttons affected:
- back
- undo
- edit
- help

### Size
Recommended shell size:
- `72 x 72 dp`

### Placement
- keep them aligned to the existing review page header row
- keep Folio title between back button and utility actions
- do not let button art overlap the title
- each top-row button should sit inside its own shell with equal visual weight

### Shadow
Shadow is created by RN style, not by redrawing the art.

Recommended shadow treatment:
- iOS:
  - `shadowColor: '#000'`
  - `shadowOpacity: 0.12`
  - `shadowRadius: 10`
  - `shadowOffset: { width: 0, height: 4 }`
- Android:
  - `elevation: 5`

Keep the shadow soft and shallow.

## Bottom difficulty row
Buttons affected:
- again
- hard
- good
- easy

### Size
Recommended shell size:
- width: `82 dp`
- height: `116 dp`

If current layout needs slightly smaller size to fit 4-across on device width, keep all four equal and preserve their aspect ratios.

### Spacing
- equal gaps between buttons
- keep the row centered
- preserve current grading order: Again, Hard, Good, Easy

### Shadows
Use the same logic as the header buttons, but slightly stronger grounding is acceptable because these are primary action buttons.

Suggested:
- iOS `shadowOpacity: 0.14`
- iOS `shadowRadius: 10`
- Android `elevation: 6`

## Rendering rules
- `resizeMode='stretch'` is acceptable because these are full-face art skins and the shell sizes are close to the original proportions.
- `overflow: 'hidden'` should generally be **off** on the outer shell if it clips the art shadow; keep clipping only where necessary.
- the button art itself should remain fully visible.
- do not place the image at partial width or partial height.

## Accessibility
Each button wrapper should expose the correct semantic label:
- Back
- Undo
- Edit current card
- Open help
- Again
- Hard
- Good
- Easy

## Acceptance checklist
A patch is acceptable only if all of the following are true:
1. Every listed button shows the packaged PNG art directly.
2. No button is showing only a corner slice of the art.
3. No extra React Native `Text` duplicates the built-in button label.
4. Pressing buttons still performs the original action.
5. Press animation feels quick and grounded.
6. The page still runs in the current Expo / React Native environment.
7. Codex did not redraw the buttons from scratch.
