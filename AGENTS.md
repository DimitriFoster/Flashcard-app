# Flashcard App – AGENTS.md

## Product Vision

This is a lightweight mobile flashcard app built for people who want studying to feel simple, calm, and approachable.

The app exists because many flashcard systems feel too complicated, too academic, or too cluttered.

This app is competing with Anki's complexity, not Anki's feature count.

The user should feel:

* Welcome
* Calm
* Focused
* Encouraged
* Productive

The app should never feel like homework before the studying even starts.

When in doubt, choose the simpler, warmer, faster option.

---

## Experience Priorities

The top priorities are:

1. Ease of use
2. Lightning-fast responsiveness
3. Warm and inviting interface design
4. Simple explanations
5. Clean professional architecture

The app should feel easy to understand within the first minute.

Users should not need a tutorial to create a deck, add cards, or start reviewing.

---

## Design Philosophy

The interface should feel:

* Warm
* Modern
* Friendly
* Calm
* Lightweight
* Touch-responsive

Avoid designs that feel:

* Corporate
* Cold
* Cluttered
* Overly academic
* Developer-focused
* Feature-heavy for its own sake

Use clear labels, generous spacing, rounded surfaces, and a small number of strong visual actions per screen.

Every screen should have one obvious primary action.

---

## Interaction Feel

The app should feel fast, physical, and satisfying.

Animation is allowed and encouraged when it improves the feeling of touch.

Use minor animations to create a sense of haptic-like responsiveness, especially when:

* Flipping cards
* Swiping cards
* Pressing primary buttons
* Creating a deck
* Adding a card
* Completing a review action
* Opening or collapsing creation sections

Animations should feel like feedback, not decoration.

Prefer:

* Short animations
* Spring-based movement
* Subtle scale changes
* Gentle opacity changes
* Card movement that follows the user's finger
* Immediate visual response on press
* Transitions that feel under the user's control

Avoid:

* Long animations
* Animations that delay input
* Decorative motion that does not clarify the interaction
* Excessive bouncing
* Heavy transitions between simple screens
* Anything that makes the user wait

Animation should make the app feel faster, not slower.

If an animation makes the user pause before continuing, simplify it.

---

## Responsiveness Rules

Perceived speed matters.

Prefer:

* Immediate response to taps
* Optimistic UI updates
* Minimal loading states
* Gesture-driven interactions
* Local-first behavior
* Simple state transitions

Avoid:

* Multi-step workflows
* Blocking modals
* Slow transitions
* Waiting screens
* Unnecessary confirmation prompts

The app should feel like it reacts the moment the user touches it.

---

## Mobile Design Rules

Design mobile-first.

Primary interactions should be comfortable with one hand.

Important buttons should be easy to reach.

Tap targets should be large enough to press comfortably.

Avoid tiny controls, dense menus, and cramped text.

The review screen should work well in both portrait and landscape orientation.

A review session should feel full-screen, focused, and distraction-free.

---

## Writing and Explanation Style

Use simple, breezy language.

Avoid academic explanations unless the user explicitly asks for detail.

Prefer labels like:

* Create deck
* Add card
* Review now
* Keep going
* Try again

Avoid labels like:

* Initialize study object
* Configure review parameters
* Execute learning session
* Submit response state

The app should sound like a helpful study buddy, not enterprise software.

---

## Architecture Principles

Keep the codebase clean, professional, and easy to change.

Preferred structure:

src/
app/
components/
storage/
types/
lib/

Guidelines:

* Screens should compose smaller components.
* Components should be focused and reusable.
* Storage logic belongs in `src/storage/`.
* Review scheduling logic belongs in `src/lib/`.
* Shared types belong in `src/types/`.
* UI components belong in `src/components/`.
* Route files in `src/app/` should stay readable and not become giant all-purpose files.

Avoid large files.

If a screen grows past roughly 300 lines, consider extracting components or helper functions.

---

## Code Quality Rules

Prioritize:

* Readability
* Maintainability
* Predictability
* Type safety
* Small focused functions
* Clear naming

Prefer straightforward code over clever abstractions.

Do not introduce large dependencies unless they clearly improve the app.

Do not add complexity just to make the app seem more advanced.

Future Dimitri should be able to return to this project after a month away and understand what is happening quickly.

---

## Current Feature Priorities

Focus on:

1. Clean deck creation
2. Clean card creation
3. Focused review sessions
4. Card flipping
5. Swipe interactions
6. Review difficulty buttons
7. Review statistics
8. Search
9. Import/export

Do not prioritize yet:

* User accounts
* Cloud sync
* AI card generation
* Social features
* Monetization
* Complex spaced repetition settings

The core question is:

Can a user create cards and comfortably review them every day?

Nothing else matters until that feels good.

---

## Review Experience

The review screen is the heart of the app.

It should feel:

* Fast
* Full-screen
* Focused
* Gesture-friendly
* Calm
* Satisfying

Users should interact with one card at a time.

The card should respond immediately to taps and swipes.

Swiping should move between cards without accidentally deleting, hiding, or reviewing them.

Difficulty buttons should be clear and easy to press.

The user should always understand what just happened after they press a review button.

---

## Navigation Rules

Use simple Expo Router navigation.

Avoid NativeTabs unless there is a strong reason to bring them back.

The app should behave like a clean stack-based flow:

Home
→ Review Decks
→ Deck Review Session

The deck review session should feel like a focused mode, not another tab.

---

## Decision Rule

When multiple solutions are possible, choose the one that makes the app:

1. Easier to understand
2. Faster to use
3. Warmer to interact with
4. Cleaner to maintain
5. Less likely to break later

Simple, fast, and pleasant beats clever, complex, and impressive.
