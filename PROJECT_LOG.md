# Flashcard App - Project Log

---

# 2026-06-18

## Navigation Architecture Investigation

### Problem

The "Open This Deck" button on the Review screen appeared to work but did not navigate to the deck review page.

The button would visually flash when pressed, indicating that the press event was firing successfully, but the application remained on the same screen.

---

### Initial Assumption

Codex's first suspicion was that the button handler itself was broken.

The review screen was attempting to navigate to:

```tsx
router.push({
  pathname: '/review/[deckId]',
  params: { deckId },
});
```

Because no navigation occurred, it appeared that either:

* The route path was incorrect
* The deck ID was invalid
* The button press handler was not executing

---

### Investigation

Further inspection revealed that the route file existed:

```txt
src/app/review/[deckId].tsx
```

The deck review page was present and correctly named.

The problem was not the route file itself.

The issue originated from the application's navigation architecture.

---

### Root Cause

The application was using a NativeTabs-based navigation setup.

The root layout rendered:

```tsx
<AppTabs />
```

instead of a normal Expo Router Stack.

Inside AppTabs only a small set of routes were explicitly registered:

```txt
index
explore
review/index
```

The dynamic review route:

```txt
review/[deckId]
```

was not part of the registered navigation tree.

As a result:

1. The button press executed successfully.
2. Expo Router attempted navigation.
3. The NativeTabs navigator did not recognize the destination.
4. Navigation silently failed.

This produced the confusing symptom where the button visibly reacted but the screen never changed.

---

### Secondary Issue

After the dynamic route was added to the navigation tree, the review page opened but displayed:

"No cards in this deck"

even when cards existed.

This occurred because the deck review route was receiving incomplete or incorrect route state.

The page loaded successfully but was unable to identify the selected deck.

The review screen therefore attempted to load cards for an undefined deck.

---

### Architectural Decision

After investigating the issue, it became clear that NativeTabs was adding unnecessary complexity to the application.

The flashcard app follows a workflow pattern:

```txt
Home
  → Review Decks
    → Review Session
```

rather than a traditional multi-section application.

The review experience is intended to be:

* Full screen
* Focused
* Gesture-driven
* Compatible with landscape mode
* Free from navigation clutter

NativeTabs was working against these goals.

---

### Decision

Move toward a Stack-based Expo Router architecture.

Desired structure:

```txt
src/app/
  _layout.tsx
  index.tsx

  review/
    index.tsx
    [deckId].tsx
```

Using:

```tsx
<Stack />
```

instead of:

```tsx
<NativeTabs />
```

Benefits:

* Simpler routing
* Cleaner navigation model
* Better support for fullscreen review sessions
* Better future support for landscape layouts
* Easier debugging
* Fewer navigation edge cases

---

### Lesson Learned

A route file existing in Expo Router does not guarantee that it is reachable.

When using custom navigation containers such as NativeTabs, every route must also exist within the active navigation tree.

Future navigation issues should be investigated in this order:

1. Does the route file exist?
2. Is the route registered?
3. Is the navigator aware of the route?
4. Is the route receiving the expected parameters?
5. Is the destination screen loading the correct data?

---

### Outcome

The project is moving away from NativeTabs and toward a simpler Stack-based architecture that better supports the intended review experience.



# 2026-06-20

## Warm and Snappy UI Refresh

### Problem

The Flashcard App interface was functional, but the overall feeling of the UI was colder and slower than desired.

The app already had the right basic structure:

```txt
Home
  → Create cards
  → Review decks
    → Focused review session
```

However, the visual style felt closer to a clean productivity dashboard than a warm, inviting flashcard tool.

The main issues were:

* Cool gray backgrounds made the app feel slightly sterile
* Small border radii made cards and panels feel rigid
* Press states relied mostly on opacity changes
* Create-section dropdown animations felt slower than necessary
* The card creation flow lacked immediate reward feedback
* The review card looked like a single flat panel instead of a physical card
* Color values, spacing, radii, and shadows were repeated across multiple files

---

### Initial Assumption

The first assumption was that the app did not need a full redesign.

The core UX direction was already solid:

* Create decks
* Add cards quickly
* Review cards in a focused session
* Use simple grading buttons for retention

The problem was not the app concept or screen layout.

The app needed a style pass focused on:

* Warmer colors
* More tactile buttons
* Faster motion
* Softer card surfaces
* More consistent shared design values

---

### Investigation

The existing UI used several repeated style patterns across Home, Create, Review, Preview, and Deck Review components.

Common patterns included:

```tsx
backgroundColor: '#F7F8FB'
borderRadius: 8
borderColor: '#D8DEE8'
opacity: pressed ? 0.78 : 1
```

The existing palette leaned heavily on cool grays, white panels, blue accents, and green accents.

The create panel also used relatively slow animation timing:

```tsx
duration: 520
easing: Easing.out(Easing.cubic)
```

This made dropdown sections feel smooth, but not especially quick.

The review session already had good interaction structure:

* Tap to flip
* Swipe left or right
* Grade with Again / Hard / Good / Easy
* Support for landscape layout

Because the interaction model was already useful, the changes focused on visual polish rather than rewriting behavior.

---

### Root Cause

The UI felt colder than intended because each component was styling itself independently.

There was no shared design system for:

* Colors
* Radius values
* Spacing values
* Shadows
* Motion timing

As a result, the app had a consistent general look, but not a strong emotional direction.

The review experience also lacked physicality.

A flashcard app benefits from feeling like the user is handling cards, but the current review screen presented the card as a flat white panel.

The card creation experience also lacked reinforcement after successful actions.

Creating a card cleared the form, but the user did not get a strong confirmation that the action succeeded.

---

### Design Direction

The chosen design direction was:

```txt
Warm study desk
Fast card handling
Soft paper surfaces
Tactile mobile controls
```

The goal was not to make the app flashy.

The goal was to make the interface feel calmer, warmer, and quicker.

The app should feel like:

* A simple study workspace
* A small stack of paper cards
* A lightweight tool that responds immediately
* A focused review environment without visual clutter

---

### Implementation Approach

No GitHub commit was made directly through the connector.

This was intentional.

A replacement-file zip was created instead so the changes can be reviewed locally in Expo and committed from the local development environment.

This keeps the workflow cleaner:

```txt
Download replacement files
  → Copy files into local repo
  → Run Expo
  → Review UI on device/emulator
  → Commit locally if accepted
```

This avoids creating connector-authored GitHub commits while still making the implementation easy to test.

---

### New Shared Design System

A new shared design token file was created:

```txt
src/constants/design.ts
```

This file centralizes core UI values:

```tsx
COLORS
RADIUS
SPACING
SHADOWS
MOTION
```

The new color palette moves the app away from cold gray-blue styling and toward warmer paper tones.

Core colors include:

```tsx
background: '#F8F3EA'
panel: '#FFFDF8'
panelAlt: '#F1E8DC'
ink: '#241F1A'
muted: '#776B5F'
line: '#E2D3C3'
```

The existing blue and green identity was preserved, but softened:

```tsx
create: '#138A72'
review: '#3457D5'
```

This keeps the app recognizable while making the surface feel warmer.

---

### Radius and Surface Changes

The app moved away from smaller, sharper corners.

Instead of relying heavily on `borderRadius: 8`, the interface now uses shared radius values:

```tsx
sm: 10
md: 16
lg: 22
xl: 28
pill: 999
```

This affects:

* Home sections
* Create panels
* Deck chips
* Review panels
* Flashcard surfaces
* Buttons
* Empty states
* Grade buttons

The result should feel softer and more mobile-native.

---

### Shadow Changes

Shared shadow styles were added:

```tsx
SHADOWS.card
SHADOWS.soft
```

These are used to give panels and cards a little more depth without making the UI look heavy.

The goal is subtle physical layering rather than dramatic shadow effects.

---

### Motion Changes

Create-section animations were made faster.

The previous animation duration was roughly:

```tsx
520ms
```

The new shared motion values are:

```tsx
fast: 180
base: 220
```

Dropdown sections now use:

```tsx
duration: MOTION.fast
easing: Easing.out(Easing.quad)
```

This should make the app feel more responsive when opening:

* The deck picker
* The new deck form
* The create card controls

---

### Press Feedback Changes

Press states were changed from mostly opacity-only feedback to opacity plus small scale movement.

The new pattern is:

```tsx
pressed: {
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
}
```

The review card uses a smaller press scale:

```tsx
cardPressed: {
  transform: [{ scale: 0.995 }],
}
```

This creates a more tactile feeling when tapping buttons and cards.

---

### Create Section Changes

The Create section was reworked to feel less like a form and more like a quick card-entry workspace.

The expanded create panel now emphasizes the selected deck first:

```txt
Deck
Selected deck name
```

The text inputs remain simple:

```txt
Front: prompt, term, or question
Back: answer, explanation, or clue
```

The controls were shortened:

```txt
New deck
Pick deck
```

The add-card button now uses deck-aware copy:

```txt
Add to Spanish
```

instead of a longer generic label.

This makes the action feel more direct.

---

### Card Creation Feedback

A temporary status message was added after successful actions.

Examples:

```txt
Deck created: Spanish ✓
Added to Spanish ✓
```

The message clears automatically after about 1.5 seconds.

This gives the user immediate confirmation without requiring a modal, toast library, or extra screen state.

---

### Deck Picker Changes

The deck picker now uses warmer card-like chips.

Deck chips use:

* Warmer panel background
* Larger corner radius
* Clear active state
* Card count display
* Press scale feedback

This should make selecting a target deck feel more like choosing a physical folder or card stack.

---

### Home Screen Changes

The Home screen now imports shared design tokens from:

```txt
src/constants/design.ts
```

The background changed to the warmer app background.

The header remains conceptually the same:

```txt
Flashcard workspace
Create decks fast, then review with intent.
```

But the screen now sits on a warmer surface, making the app feel less sterile.

---

### Review Entry Section Changes

The Home review call-to-action was updated to use the shared design system.

The Review panel now uses:

* Warm panel background
* Shared border color
* Softer radius
* Subtle shadow
* Press scale feedback

The Review button remains visually blue so review stays distinct from creation.

---

### Review Index Changes

The Review index screen was updated to use shared design tokens.

The two preview panels now sit on the warmer background and use softer panel styling.

The “Create cards” button now uses the shared review accent colors and tactile press feedback.

The retention note was also warmed with a soft warning color treatment.

---

### Preview Panel Changes

The reusable `PreviewPanel` component was updated to match the new design language.

Changes include:

* Warmer preview panel background
* Softer card surface
* Larger rounded corners
* Shared spacing values
* Shared color values
* Better disabled button styling
* Press scale feedback on “Open this deck”

This keeps the Review index visually consistent with the rest of the app.

---

### Deck Review Session Changes

The focused deck review session received the most important visual change.

The review card now sits inside a card stack structure:

```tsx
cardStack
  cardStackBack
  cardStackMiddle
  cardShell
    card
```

This makes the review session feel more like handling a small deck of cards instead of looking at one flat panel.

The tap hint was also tightened:

```txt
Tap to flip · Swipe to browse
```

This is shorter and more polished than the previous instructional copy.

---

### Grade Button Changes

The grading buttons still use the same review options:

```txt
Again
Hard
Good
Easy
```

Each button now includes a small helper label:

```txt
Again  → soon
Hard   → short
Good   → normal
Easy   → later
```

This makes the spaced repetition behavior easier to understand without adding a tutorial screen.

The grade buttons also use warm semantic colors:

* Again: warning tone
* Hard: danger tone
* Good: review blue
* Easy: create green

---

### Affected Files

The replacement zip includes changes to these files:

```txt
src/constants/design.ts

src/app/index.tsx
src/app/review/index.tsx

src/components/home/create-section.tsx
src/components/home/create-section.styles.ts
src/components/home/review-section.tsx

src/components/review/preview-panel.tsx
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
```

---

### Files Recreated or Added

A new shared design file was added:

```txt
src/constants/design.ts
```

This file should become the central place for future UI styling decisions.

Future components should avoid hardcoding repeated colors and spacing values when possible.

---

### Testing Plan

The changes should be reviewed in Expo before committing.

Recommended test flow:

1. Start the app with a clean cache:

```bash
npx expo start --clear
```

2. Open the Home screen.

3. Confirm the warmer background and section styling.

4. Expand the Create section.

5. Test opening and closing:

```txt
New deck
Pick deck
```

6. Confirm the animations feel faster.

7. Create a new deck.

8. Confirm the status message appears:

```txt
Deck created: [name] ✓
```

9. Add a card to a selected deck.

10. Confirm the status message appears:

```txt
Added to [deck] ✓
```

11. Navigate to Review.

12. Confirm the preview panels still load the correct cards.

13. Open a deck.

14. Confirm the review card stack renders correctly.

15. Test:

```txt
Tap to flip
Swipe left/right
Again
Hard
Good
Easy
Back
```

16. Rotate the device or emulator to landscape and confirm the review layout still behaves correctly.

---

### Risks

The changes are mostly visual, but a few areas should be watched carefully.

Potential risks:

* Animation heights may need small adjustment on different screen sizes
* Long deck names may crowd the `Add to [deck name]` button
* The card stack shadows may need tuning on Android
* The warm palette may need contrast review outdoors or at low brightness
* Status messages may need better placement if the create panel grows more complex

No storage, scheduling, or route logic was intentionally changed.

---

### Lesson Learned

A UI can be technically clean but still feel emotionally wrong.

The first version worked, but it did not fully match the desired product feeling.

For this app, the interface should support the learning loop:

```txt
Capture quickly
Review calmly
Get feedback immediately
Return later
```

Small details matter:

* A faster dropdown makes the app feel lighter
* A checkmark after adding a card reinforces progress
* A card stack makes review feel more physical
* Warmer colors make repeated study feel less clinical
* Shared design tokens prevent the UI from drifting as the app grows

---

### Outcome

A warmer and snappier UI pass was prepared as local replacement files.

The changes have not been committed yet.

The next step is to copy the replacement files into the local project, run Expo, and decide whether this visual direction should become the new baseline for the Flashcard App.

If accepted, the project will have a stronger design foundation through:

* Shared design tokens
* Warmer visual identity
* Faster motion
* Better tactile feedback
* Clearer card creation feedback
* A more physical review session

---

# 2026-06-27

## Notes Section and Lined Notebook Page

### Summary

Added a third Home screen section labeled `notes` under the Review section.

The new section opens a dedicated Notes route for quick freeform writing. The Notes screen is styled like a clean A5 lined notebook page with a soft yellow app section color, faint horizontal ruling, and a left-side saved-notes panel.

### Changes

- Added a soft pastel yellow Notes section on the Home screen.
- Added a new `/notes` route.
- Added local MMKV-backed note storage.
- Added a left panel showing previously saved notes.
- Added a blank-note writing state when the Notes page opens.
- Added a `New` button for starting another note.
- Added note selection so saved notes can be opened and edited immediately.
- Added a yellow `Save & close` button in the top right.
- Added a `Back home` button with an unsaved-changes warning.

### Files Touched

```txt
src/app/index.tsx
src/app/_layout.tsx
src/app/notes/index.tsx
src/components/home/notes-section.tsx
src/components/ui/crayon-fill.tsx
src/constants/design.ts
src/storage/notes.ts
src/types/note.ts
PROJECT_LOG.md
```

### Notes

The notebook page intentionally avoids new native dependencies. The lined-paper look is created with plain React Native views behind a multiline `TextInput`.

This keeps the feature mobile-safe while still giving the Notes route a distinct paper-notebook feeling.

### Outcome

The app now has three main Home actions:

```txt
Create  → make decks and cards
Review  → study existing decks
Notes   → capture longer freeform thoughts
```

This gives the app a stronger capture-to-study workflow. Loose thoughts can now live in Notes before being turned into flashcards later.


---

# 2026-06-27

## Notebook Drag Fix Reapplied to Current Build

### Summary

The latest notebook drag/title fixes were reapplied on top of the current Codex-edited build.

### Changes

- Notebook title/header controls now flex so long notebook names have more room.
- Notebook action buttons resize slightly based on notebook title length.
- Drag hover detection checks both X and Y coordinates.
- Notes can highlight as drop targets.
- Dragged notes show a floating preview so they remain visible above the sidebar and yellow editor border.
- Dragging a notebook note onto a loose note creates a fresh notebook for those two notes instead of pulling the loose note into the selected notebook.

### Files Touched

```txt
src/app/notes/index.tsx
src/storage/notes.ts
PROJECT_LOG.md
```


---

# 2026-06-27

## Notebook Hover and Drag Preview Fix

### Summary

Fixed notebook/note hover highlighting, constrained the notebook title input more aggressively, and removed the double-image effect while dragging notes.

### Changes

- Hover detection now uses a forgiving hit area around notes and notebooks.
- Notes now have their own yellow drop-target highlight style.
- Dragging now uses the floating preview as the moving object.
- The original dragged card fades in place instead of moving with the preview.
- Notebook title input now uses a calculated width and calculated font size based on title length.
- Notebook title input is bounded with overflow protection so it should not leak out of the notebook panel header.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Notes Scroll, Delete, and Keyboard Behavior

### Summary

Improved sidebar scrolling, added a delete button to the open note editor, and changed note editing so the keyboard requires a deliberate second tap.

### Changes

- Sidebar note list now uses nested scrolling and responder settings intended to make vertical scrolling less sticky.
- Note drag responder no longer blocks native scroll responders as aggressively.
- Open notes now show a square trash-can delete button in the top right of the notebook page.
- Selecting a saved note no longer immediately focuses the editor.
- The note editor now requires two taps before the keyboard opens:
  - first tap arms the editor
  - second tap focuses the text input
- Notebook name editing still works with one tap.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Scrolling Notebook Lines

### Summary

Fixed long notes so the lined-paper ruling scrolls with the note text instead of staying fixed behind it.

### Changes

- Increased the number of rendered notebook lines for longer notes.
- Converted the line layer to an animated layer.
- Synced the line layer with the note editor `TextInput` scroll position.
- Reset editor scroll position when opening a different note or creating a blank note.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Conditional Note Scrolling

### Summary

The note editor now only scrolls when the note text is taller than the visible notebook page.

### Changes

- Tracks editor viewport height.
- Tracks actual text content height.
- Enables `TextInput` scrolling only when content flows beyond the visible page.
- Resets notebook line scroll when the note fits on one page.
- Clears stale content-height measurements when opening or creating notes.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Keyboard-Aware Note Editing

### Summary

Adjusted the Notes editor so longer notes remain usable while the mobile keyboard is open.

### Changes

- Added keyboard show/hide listeners.
- Enabled `KeyboardAvoidingView` height behavior on Android.
- Keeps editor scrolling available while the keyboard is open.
- Adds extra bottom padding inside the editor while typing so the cursor can scroll above the keyboard.
- Prevents the line-scroll position from resetting while the keyboard is open.
- Slightly compresses the top header while editing to give the notebook page more room.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Keyboard Gap and Line Clipping Fix

### Summary

Removed the artificial keyboard gap in the note editor and adjusted the ruled-paper layer so it clips with the text area.

### Changes

- Removed Android `KeyboardAvoidingView` height behavior that could leave a lingering gray bar after closing the keyboard.
- Removed the large keyboard-specific bottom padding inside the note editor.
- Editor scrolling is again based on whether the text flows beyond the visible notebook page.
- Wrapped the note text and ruled lines in the same clipped writing surface so lines stop where the visible text area stops.
- Kept the notebook page's normal bottom cutoff as the place where text and lines disappear.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Manual Keyboard Viewport and Unified Note Scrolling

### Summary

Reworked the open-note editor so the text and ruled lines scroll as one notepaper surface, and added a manual keyboard inset that shrinks only the writing viewport.

### Changes

- Removed the independent animated line transform.
- Moved the ruled lines inside the same scrollable content surface as the note text.
- Changed the note editor from internal `TextInput` scrolling to an outer `ScrollView`.
- The text input now grows with content while the outer notepaper surface scrolls.
- Lines and text now share the same clipping behavior.
- Tracks keyboard height and applies a temporary bottom margin only to the writing viewport, avoiding Android root resize behavior and the lingering gray bar.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Last-Pass Keyboard Editing Adjustment

### Summary

Removed the keyboard-driven viewport margin that was causing the bottom gray/blank bar and changed keyboard handling to add scrollable room inside the notepaper surface instead.

### Changes

- Removed the manual `marginBottom` applied to the editor viewport.
- Kept the unified notepaper scrolling where lines and text move together.
- Added keyboard-aware scroll padding inside the notepaper content instead of resizing the whole app root.
- Added a `ScrollView` ref so typing while the keyboard is open can keep the active writing area visible.
- Clears keyboard state on editor blur to prevent stale bottom spacing from sticking around.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Responsive Notebook Title Controls

### Summary

Adjusted the notebook overview title row so the three square buttons make room for longer notebook names without becoming too small.

### Changes

- Notebook action buttons now shrink gradually as the notebook title gets longer.
- Buttons stop shrinking at a safe minimum size.
- Notebook title font size scales down after the title gets long.
- Notebook title input gets more available width and tighter padding.
- Button icon sizes now follow the button size.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Hard-Fit Notebook Title Calculation

### Summary

Notebook title scaling now uses a direct font-size calculation instead of relying on `TextInput` auto-fit behavior.

### Changes

- Calculates title font size from title length and available title input width.
- Allows buttons to shrink first to a safe minimum.
- Lets the title font shrink as low as 9px for long notebook names.
- Removes unreliable `adjustsFontSizeToFit` behavior from the notebook title `TextInput`.
- Hard-bounds the notebook title input width so it cannot fight the action buttons.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Notebook Title Width and Blank Default

### Summary

Notebook title input now resizes with the title length and blank notebook names save back to the default `Notebook` title.

### Changes

- Title input width now grows with the current title length instead of staying at a large fixed width.
- Title input is capped more conservatively so the rounded left edge stays inside the notebook panel.
- Long titles still shrink the font to fit once the input reaches its max safe width.
- Empty notebook names now save as `Notebook`.
- The title draft is reset to the saved default after blur.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Notebook Title Slot Fit

### Summary

Moved the notebook title input into a bounded flex slot so the full rounded text box stays inside the open notebook panel.

### Changes

- The title input is now wrapped in a flexible slot that owns the available space before the action buttons.
- The rounded text box can grow up to its natural width but is capped by the slot.
- Removed the screen-width based max-width estimate that could overstate available panel space.
- The action row no longer clips the title input from the left.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-27

## Reapplied Crayon Textures with Static PNG Assets

### Summary

Reapplied the Create / Review / Notes textured pastel backgrounds using the approved green, blue, and yellow images.

### Changes

- Replaced the solid-color fallback `CrayonFill` with a static local-image texture implementation.
- Added three baked texture PNGs:
  - green for Create
  - blue for Review
  - yellow for Notes
- Kept rendering simple on mobile by using a single non-repeating image per tone instead of SVG/repeat pattern code.
- Texture selection is centralized in `src/components/ui/crayon-fill.tsx`, so any section already using `CrayonFill` should pick up the new textures automatically.

### Files Touched

```txt
src/components/ui/crayon-fill.tsx
assets/images/crayon/create-green-texture.png
assets/images/crayon/review-blue-texture.png
assets/images/crayon/notes-yellow-texture.png
PROJECT_LOG.md
```


---

# 2026-06-27

## Spaced Repetition Foundation

### Summary

Added the first real spaced-repetition engine layer: card states, learning/relearning steps, review queue ordering, review logs, and undo for the last graded review.

### Changes

- Added card states:
  - `new`
  - `learning`
  - `review`
  - `relearning`
  - `suspended`
- Added `learningStepIndex` to cards.
- New cards now enter short learning steps before graduating to long-term review.
- Failed review cards now enter relearning instead of only changing interval math.
- Review queue now orders cards as:
  1. due learning cards
  2. due relearning cards
  3. due review cards
  4. limited new cards
- Added a daily new-card limit constant.
- Added review logs for graded reviews.
- Added undo support for the last graded review.
- Added an Undo button to the focused review screen after grading a card.
- Fixed graded-card advancement so the next card in the due queue is not skipped after the reviewed card leaves the queue.

### Files Touched

```txt
src/types/flashcard.ts
src/lib/review-scheduling.ts
src/lib/review-queue.ts
src/storage/flashcards.ts
src/app/review/[deckId].tsx
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
PROJECT_LOG.md
```

---

# 2026-06-27

## Import, Edit, Stats, and Browse Search

### Summary

Added the next learning-experience features: CSV/TSV/TXT import, JSON app backup restore/export, card editing during review, a scheduler stats page, and Browse deck/card search.

### Changes

- Added a paste-based CSV/TSV/TXT importer in the Create section.
- Added an Import dropdown to the right of Pick deck.
- Import supports:
  - Add to existing deck
  - Create new deck from file
  - Skip duplicates for existing-deck imports
  - Import duplicates anyway for existing-deck imports
- Imported cards are treated as new SRS cards.
- Added JSON app backup export and restore.
- Added card editing during focused review.
- Added a simple scheduler stats page at `/review/stats`.
- Added a Stats button on the spaced repetition page.
- Added a Browse search bar that searches deck names, card prompts, and card answers.

### Files Touched

```txt
src/app/index.tsx
src/app/review/[deckId].tsx
src/app/review/browse.tsx
src/app/review/index.tsx
src/app/review/stats.tsx
src/components/home/create-section.tsx
src/components/home/create-section.styles.ts
src/components/review/deck-review-session.tsx
src/components/review/deck-review-session.styles.ts
src/lib/import-parser.ts
src/storage/flashcards.ts
PROJECT_LOG.md
```

### Notes

The importer currently accepts pasted file contents instead of using a native file picker. This avoids adding document-picker dependencies while the app is still stabilizing.


---

# 2026-06-27

## Device File Picker Import Flow

### Summary

Changed the Create-section import flow from pasted card contents to device file picking through Expo DocumentPicker, and separated JSON app backup into its own mechanism.

### Changes

- Added Expo document picking for CSV / TSV / TXT card imports.
- Added file reading through Expo FileSystem legacy API.
- Import dropdown now has action buttons:
  - Add file to existing deck
  - Create new deck from file
  - JSON app backup
- Add-to-existing import uses the currently selected deck.
- Duplicate handling is available for add-to-existing imports.
- Create-new-deck import creates a deck name from the first detected deck column value, falling back to the filename.
- JSON backup restore now has a separate file-picker path.
- Backup export remains visible as copyable JSON.

### Files Touched

```txt
package.json
src/components/home/create-section.tsx
src/components/home/create-section.styles.ts
PROJECT_LOG.md
```


---

# 2026-06-28

## Native Module Guard for File Import

### Summary

Prevented the app from crashing at launch when the installed development build does not contain the native `ExpoDocumentPicker` module.

### Changes

- Removed top-level static imports for `expo-document-picker` and `expo-file-system`.
- Loads file picker modules only when the user presses an import/restore button.
- If the native module is unavailable, the app now shows a status message instead of failing during startup.
- Added import-panel helper text explaining that device file upload needs Expo Go or a rebuilt development build.

### Files Touched

```txt
src/components/home/create-section.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Browse Search Opens Matching Cards

### Summary

Changed Browse Decks so card-search results stay filtered when a deck is opened.

### Changes

- Browse search now distinguishes deck-name matches from card-text matches.
- If the search matches card prompts/answers, the deck preview shows the matching card count.
- Opening that deck passes the card-search query into the deck route.
- The deck route filters browse-mode cards by that search query.
- Back navigation returns to Browse Decks with the same search text restored.
- Deck-name-only searches still open the full deck.

### Files Touched

```txt
src/app/review/browse.tsx
src/app/review/[deckId].tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Review Preview Bubble Titles

### Summary

Cleaned up the review/browse deck preview cards by removing the duplicated black deck-title text and making the top-right deck bubble the primary title.

### Changes

- Removed the large black deck title from preview panels.
- Kept the helper/count text on the left side of the preview header.
- Enlarged the top-right deck badge.
- Increased badge text weight and size so the badge reads as the deck title.

### Files Touched

```txt
src/components/review/preview-panel.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Save Button Keeps Draft Open

### Summary

Fixed the Notes screen Save button so it actually saves the current note without closing it or clearing the editor.

### Changes

- Replaced the old save-and-start-new behavior with a save-current-note behavior.
- Pressing Save now persists the note and keeps the saved note open.
- The existing New button remains responsible for starting a blank note.
- Notebook notes now also stay open after saving instead of returning to the notebook overview.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Save Confirmation and Edit Persistence

### Summary

Fixed follow-up saves in the Notes screen and added a low-key save confirmation.

### Changes

- Added a body ref so the Save button reads the latest editor text even if the text input has not finished a render cycle.
- Save now updates the local notes list immediately after writing to storage.
- Existing notes keep their selected note ID after saving, so later edits save back into the same note.
- Added a small "Saved" pill under the top bar after a successful save.
- The confirmation fades away automatically after a short delay.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Save Verification

### Summary

Made Notes saving stricter so the Save confirmation only appears after the current editor body has been written and verified from storage.

### Changes

- Added refs for the active note ID and notebook ID so Save does not depend on possibly stale React state.
- Save now writes the current draft body using the active note ID ref.
- Save now reloads the note from storage and verifies the stored body matches the current editor body.
- The app only shows "Saved" after verification succeeds.
- If verification fails, the save status shows "Save failed" instead.
- Added an end-editing sync for the note body so keyboard/blur edge cases keep the draft body current.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Autosave for Existing Notes

### Summary

Added autosave for existing notes to avoid stale-text saves from the top Save button.

### Changes

- Existing notes now save shortly after each edit.
- The Save button now clears any pending autosave and force-saves the current draft body.
- Shared the manual save and autosave logic through one verified save helper.
- New unsaved notes still require the first manual Save so an empty draft is not created accidentally.
- The "Saved" message remains tied to manual Save, while autosave runs quietly in the background.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Safe Switching

### Summary

Fixed note switching so edits are not lost when opening another note before leaving the Notes page.

### Changes

- Note switching now force-saves the current draft before opening another note.
- The screen no longer relies only on the `isDirty` state, which can be one render behind.
- Opening another note now reloads that note from storage by ID instead of trusting the rendered list object.
- Removed the `onEndEditing` draft sync because it could fire after switching notes and restore stale text.
- New note, notebook overview, and notebook-note creation actions also force-save the current draft first.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Read-Scroll Before Typing

### Summary

Adjusted the Notes editor interaction so users can scroll an open note immediately without accidentally opening the keyboard, while typing still requires two deliberate taps.

### Changes

- Editor scrolling is enabled immediately instead of waiting on the editor's scrollability calculation.
- The scroll indicator still only appears when the note content is actually taller than the viewport.
- Added a scroll-begin handler that keeps the editor in read mode when the keyboard is not already visible.
- The unarmed TextInput no longer captures touch events, so swipes can go straight to the ScrollView.
- First tap on the note page arms the editor.
- Second tap focuses the TextInput and opens the keyboard.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Line Sync Fix

### Summary

Fixed long-note scrolling where ruled notebook lines and note text could drift out of sync.

### Changes

- Removed the fixed notebook line count.
- The ruled lines now generate dynamically based on the current scrollable surface height.
- Snapped the editor surface height to the notebook line grid.
- The TextInput and ruled-line layer now use the same snapped surface height.
- Moved the text top padding into a shared constant derived from the line top offset.
- Disabled Android font padding inside the editor TextInput to reduce line-height drift over long notes.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Top Offset Repair

### Summary

Fixed a crash caused by stale notebook-line constants after the Notes line-sync patch.

### Changes

- Removed the old `NOTEBOOK_TOP_OFFSET` and `NOTEBOOK_LINE_COUNT` references from the notebook line layer style.
- The notebook line layer now receives the current dynamic editor surface height directly.
- This repairs the runtime error: `Property 'NOTEBOOK_TOP_OFFSET' doesn't exist`.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Read Layer Line Sync

### Summary

Changed the Notes editor so open-note reading uses a separate read-mode text layer instead of an unarmed TextInput.

### Changes

- When the editor is not armed, notes render through a normal Text layer.
- The TextInput only mounts after the first tap arms the editor.
- This keeps immediate scrolling/read mode safer and should reduce long-scroll line drift.
- Both the read text layer and TextInput still use the same notebook line height and padding constants.
- Two-tap typing behavior is preserved.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Hide Note Lines While Editing

### Summary

Stopped ruled notebook lines from showing while actively editing notes.

### Changes

- Ruled lines now appear in read mode only.
- When the editor is armed and the TextInput is active, the lines are hidden.
- This avoids Android multiline TextInput line-height drift against a separate line overlay.
- Leaving edit mode brings the lined-paper read view back.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Remove Open Note Ruled Lines

### Summary

Removed the ruled-line overlay from the open note editor because Android multiline text rendering was drifting against it and the read/edit transition caused visible line flicker.

### Changes

- Removed the ruled-line layer from the open note editor.
- Removed the dynamic `NotebookLines` component from the Notes screen.
- Removed stale notebook-line styles and line-position constants.
- Kept the plain paper surface, two-tap typing behavior, and immediate scrolling.
- This favors a stable editing/reading surface over fake lined-paper precision.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes No Jump While Editing

### Summary

Fixed open notes jumping to the bottom after scrolling and then typing or backspacing.

### Changes

- Removed the automatic `scrollToEnd` call from note body changes.
- Typing and backspacing now preserve the current scroll position.
- Autosave still runs after edits.
- Keyboard padding behavior remains unchanged.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Stable Notes Scroll Surface

### Summary

Reduced note editor jerking by keeping one stable TextInput mounted during both read and edit states.

### Changes

- Removed the read-layer/TextInput swap that could reflow the editor surface mid-gesture.
- Removed the scroll-begin handler that de-armed the editor during drag.
- The TextInput now stays mounted at all times.
- When unarmed, the TextInput displays text but ignores touches and does not open the keyboard.
- First tap still arms editing.
- Second tap still focuses the keyboard.
- Scrolling no longer flips editor mode.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Keyboard Caret Nudge

### Summary

Restored keyboard accommodation without bringing back the old jump-to-bottom behavior.

### Changes

- Added scroll-position tracking for the open note editor.
- Added caret selection tracking for the active TextInput.
- Added a targeted `keepCaretVisible` helper.
- Typing now nudges the editor only when the estimated caret position would fall behind the keyboard.
- Removed any need for `scrollToEnd` on text changes.
- The current scroll position is preserved unless the caret needs room above the keyboard.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Selection Event Repair

### Summary

Fixed a crash caused by reading the TextInput selection event after React Native had released the synthetic event.

### Changes

- Copies `event.nativeEvent.selection` into a plain variable immediately.
- Uses the copied selection inside `requestAnimationFrame`.
- Makes `keepCaretVisible` tolerate null or missing selection values.
- Fixes: `Cannot read property 'selection' of null`.
- Removes the synthetic event pooling console warning caused by the same issue.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Collapsible Saved Panel

### Summary

Added a collapsible Saved notes/notebooks panel so the Notes editor opens in a wider writing mode by default.

### Changes

- Saved notes/notebooks panel is now closed by default when opening Notes.
- Added a narrow "Saved" tab to reopen the panel.
- Added a close button inside the Saved panel header.
- Opening and closing the panel preserves the current note, body text, notebook state, and editor mode.
- If the editor was active, the app attempts to restore focus after opening or closing the panel.
- Caret-width estimation now accounts for whether the Saved panel is open or closed.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Collapsed Saved Rail Polish

### Summary

Polished the collapsed Saved rail and made the Saved panel controls easier to use.

### Changes

- Collapsed Saved label now stays on one line.
- Collapsed rail now uses the yellow notes color scheme.
- Added a small plus button on the collapsed rail for starting a new note.
- Moved the Saved panel collapse button beside the Saved title so it is not hidden behind the editor.
- Made the open panel header less cramped.
- Added z-index/elevation to the close button for safer visibility.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes Saved Header And Empty Save Pulse

### Summary

Adjusted the Saved panel controls and added a visible empty-save acknowledgement.

### Changes

- Moved the Saved panel collapse button underneath the New button.
- Kept the "Hold + drag to group" text below the header without pushing into it.
- Forced the Saved title to stay on one line with font scaling.
- Added a short red pulse/flash to the visible New note control when Save is pressed with no note text.
- The pulse applies to the open-panel New button and the collapsed-panel plus button.
- Empty save now also shows "Add text first" in the save status pill.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Notes New Button Empty Press Pulse

### Summary

Made the New note controls visibly acknowledge presses when the user is already on a blank new note.

### Changes

- Added an `isBlankNewNoteDraft` helper.
- Pressing New while already on a blank unsaved note now pulses the New controls red.
- The open Saved-panel New button and collapsed rail + button both use the existing red pulse style.
- Shows "Already blank" in the save status pill instead of silently doing nothing.
- Existing behavior is preserved when the current note has text or is an existing saved note.

### Files Touched

```txt
src/app/notes/index.tsx
PROJECT_LOG.md
```


---

# 2026-06-28

## Light Scroll Snapping

### Summary

Added subtle snap/settle behavior to carousel and panel-style scrolling areas.

### Changes

- Deck picker carousel now snaps cleanly from deck chip to deck chip.
- Browse deck carousel now snaps from preview panel to preview panel.
- Managed card list in the Create panel now has light row snapping.
- Saved notes/notebooks list now has light card snapping.
- Notebook overview note list now has light card snapping.
- Home and Browse vertical page scrolls now settle faster over large stacked panels.
- The open note text editor was intentionally left unsnapped to avoid fighting typing and caret movement.

### Files Touched

```txt
src/app/index.tsx
src/app/notes/index.tsx
src/app/review/browse.tsx
src/components/home/create-section.tsx
PROJECT_LOG.md
```
