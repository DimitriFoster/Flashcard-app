import type { ImageSourcePropType } from 'react-native';

import type { Deck, Flashcard } from '@/types/flashcard';

export const deckTopicIcons = {
  ai: require('../../assets/folio-ui/topic-icons/starter-transparent/ai_brain_cloud.png'),
  python: require('../../assets/folio-ui/topic-icons/starter-transparent/python_snakes.png'),
  language: require('../../assets/folio-ui/topic-icons/starter-transparent/spanish_hola.png'),
  writing: require('../../assets/folio-ui/topic-icons/starter-transparent/writing_notebook_pencil.png'),
  music: require('../../assets/folio-ui/topic-icons/starter-transparent/music_notes.png'),
  science: require('../../assets/folio-ui/topic-icons/starter-transparent/science_flask.png'),
  geography: require('../../assets/folio-ui/topic-icons/starter-transparent/geography_earth_pin.png'),
  math: require('../../assets/folio-ui/topic-icons/starter-transparent/math_notepad.png'),
  general: require('../../assets/folio-ui/topic-icons/starter-transparent/writing_notebook_pencil.png'),
} as const;

export type DeckTopic = keyof typeof deckTopicIcons;

export function inferDeckTopic(deckName: string, sampleText = ''): DeckTopic {
  const text = `${deckName} ${sampleText}`.toLowerCase();

  if (/\b(ai|llm|rag|embedding|embeddings|token|model|neural|machine learning|architecture)\b/.test(text)) return 'ai';
  if (/\b(python|django|flask|pandas|numpy|operator|operators|script|typescript|javascript|react|code|coding)\b/.test(text)) return 'python';
  if (/\b(spanish|language|phrases|vocab|vocabulary|grammar|hola|translate|translation)\b/.test(text)) return 'language';
  if (/\b(write|writing|notes|essay|journal|composition|pen|notebook)\b/.test(text)) return 'writing';
  if (/\b(music|song|chord|scale|guitar|piano|melody|rhythm|theory)\b/.test(text)) return 'music';
  if (/\b(science|chemistry|biology|lab|flask|experiment|physics)\b/.test(text)) return 'science';
  if (/\b(geography|map|country|earth|location|travel|world)\b/.test(text)) return 'geography';
  if (/\b(math|algebra|calculus|geometry|equation|statistics|stats)\b/.test(text)) return 'math';

  return 'general';
}

export function getDeckTopicIcon(deck: Deck, sampleCards: Flashcard[] = []): ImageSourcePropType {
  const sampleText = sampleCards.slice(0, 4).map((card) => `${card.front} ${card.back}`).join(' ');
  return deckTopicIcons[inferDeckTopic(deck.name, sampleText)];
}
