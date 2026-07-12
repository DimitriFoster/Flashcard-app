# Maestro test flows for Folio

These flows make Folio testable from a repeatable local state.

## Prerequisites

1. Install Maestro on your computer.
2. Start an Android emulator or connect your Android phone.
3. Install/run the Folio dev build:

```bash
npx expo run:android
npx expo start --dev-client
```

## Run the smoke suite

From the project root:

```bash
npm run maestro:smoke
```

Equivalent direct command:

```bash
maestro test .maestro/smoke
```

## Important: test data reset

The smoke flows open this development-only route first:

```text
flashcardapp://maestro-seed
```

That route replaces local app data with a small deterministic fixture:

- Spanish Basics
- AI Systems
- Python Operators

This is intentional. It prevents Maestro from depending on whatever decks happen to be imported on the test phone.

The seed route only performs the reset in development builds. Do not use it as a user-facing feature.

## What the smoke flows cover

- `seed.yaml`: verifies the dev seed route works.
- `browse-decks.yaml`: opens Browse Decks, searches for AI, and checks the AI Systems deck is selectable.
- `browse-session.yaml`: opens the AI Systems deck in browse mode, flips a card, and advances to the next card.
- `review-index.yaml`: opens the Review Due Cards screen from the seeded state.
- `review-session.yaml`: opens a due review session and grades one card.

## Visual regression comes later

The `.maestro/visual` folder is intentionally a placeholder right now. Do not lock screenshot baselines while the Folio layout is still moving. Once a screen is visually approved, capture baselines for cropped areas such as:

- Browse Decks hero header
- Browse session colored mini-card strip
- Review card area
- Bottom controls
