/**
 * Deterministic Maestro test fixture data.
 *
 * This file gives mobile automation a repeatable starting point without
 * depending on whatever decks are currently stored on a developer phone.
 * It should only be invoked from the dev-only /maestro-seed route.
 */
import { importAppBackupText } from './flashcards';
import type { AppBackup } from './flashcards';

const FIXTURE_TIMESTAMP = '2026-07-05T12:00:00.000Z';
const DUE_TIMESTAMP = '2020-01-01T12:00:00.000Z';

export const MAESTRO_FIXTURE_DECK_IDS = {
  spanish: 'maestro-deck-spanish',
  aiSystems: 'maestro-deck-ai-systems',
  python: 'maestro-deck-python',
} as const;

const maestroBackup: AppBackup = {
  version: 1,
  exportedAt: FIXTURE_TIMESTAMP,
  decks: [
    {
      id: MAESTRO_FIXTURE_DECK_IDS.spanish,
      name: 'Spanish Basics',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
    },
    {
      id: MAESTRO_FIXTURE_DECK_IDS.aiSystems,
      name: 'AI Systems',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
    },
    {
      id: MAESTRO_FIXTURE_DECK_IDS.python,
      name: 'Python Operators',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
    },
  ],
  flashcards: [
    {
      id: 'maestro-card-ai-rag',
      deckId: MAESTRO_FIXTURE_DECK_IDS.aiSystems,
      front: 'What does RAG add to an AI assistant?',
      back: 'Retrieval-augmented generation lets the assistant pull relevant external context before answering.',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'review',
      learningStepIndex: 0,
      dueAt: DUE_TIMESTAMP,
      intervalDays: 3,
      easeFactor: 2.5,
      repetitions: 2,
      lapses: 0,
    },
    {
      id: 'maestro-card-ai-embedding',
      deckId: MAESTRO_FIXTURE_DECK_IDS.aiSystems,
      front: 'What is an embedding?',
      back: 'A numeric representation of meaning that can be compared with nearby vectors.',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'new',
      learningStepIndex: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
    },
    {
      id: 'maestro-card-ai-context',
      deckId: MAESTRO_FIXTURE_DECK_IDS.aiSystems,
      front: 'Why does context quality matter?',
      back: 'The model can only reason from the information placed into the prompt window.',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'review',
      learningStepIndex: 0,
      dueAt: DUE_TIMESTAMP,
      intervalDays: 1,
      easeFactor: 2.3,
      repetitions: 1,
      lapses: 0,
    },
    {
      id: 'maestro-card-spanish-hola',
      deckId: MAESTRO_FIXTURE_DECK_IDS.spanish,
      front: 'hola',
      back: 'hello',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'review',
      learningStepIndex: 0,
      dueAt: DUE_TIMESTAMP,
      intervalDays: 2,
      easeFactor: 2.5,
      repetitions: 1,
      lapses: 0,
    },
    {
      id: 'maestro-card-spanish-gracias',
      deckId: MAESTRO_FIXTURE_DECK_IDS.spanish,
      front: 'gracias',
      back: 'thank you',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'new',
      learningStepIndex: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
    },
    {
      id: 'maestro-card-python-floor-division',
      deckId: MAESTRO_FIXTURE_DECK_IDS.python,
      front: 'What does // do in Python?',
      back: 'It performs floor division and returns the quotient rounded down.',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'review',
      learningStepIndex: 0,
      dueAt: DUE_TIMESTAMP,
      intervalDays: 4,
      easeFactor: 2.5,
      repetitions: 3,
      lapses: 0,
    },
    {
      id: 'maestro-card-python-exponent',
      deckId: MAESTRO_FIXTURE_DECK_IDS.python,
      front: 'What does ** do in Python?',
      back: 'It raises the left value to the power of the right value.',
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      state: 'new',
      learningStepIndex: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
    },
  ],
  reviewLogs: [],
  notes: [],
  notebooks: [],
};

export function seedMaestroFixtureData() {
  return importAppBackupText(JSON.stringify(maestroBackup));
}
