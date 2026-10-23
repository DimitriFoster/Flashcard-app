export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';
export type FolioTab = 'review' | 'notes' | 'progress' | 'browse';
export type SessionTokenStatus = 'new' | 'again' | 'hard' | 'good' | 'easy' | 'empty';

export type ReviewCard = {
  id: string;
  question: string;
  answer: string;
};

export type FolioReviewScreenProps = {
  deckTitle: string;
  deckSubtitle?: string;
  dueCount: number;
  totalCards: number;
  cardsLeft: number;
  currentCardNumber: number;
  sessionTotalCards: number;
  card: ReviewCard;
  sessionTokens?: SessionTokenStatus[];
  activeTokenIndex?: number;
  onBack?: () => void;
  onUndo?: () => void;
  onEdit?: () => void;
  onHelp?: () => void;
  onGrade?: (grade: ReviewGrade) => void;
  onNavigateTab?: (tab: FolioTab) => void;
};
