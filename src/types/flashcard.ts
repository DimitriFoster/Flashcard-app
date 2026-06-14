export type Flashcard = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
  intervalDays?: number;
  easeFactor?: number;
  repetitions?: number;
  lapses?: number;
  lastReviewedAt?: string;
  lastStruggledAt?: string;
};

export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type NewFlashcard = {
  deckId: string;
  front: string;
  back: string;
};

export type NewDeck = {
  name: string;
};

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';
