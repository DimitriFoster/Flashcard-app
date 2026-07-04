import React from 'react';

import { FolioAgainIcon } from './FolioAgainIcon';
import { FolioBackIcon } from './FolioBackIcon';
import { FolioBrowseSafeIcon } from './FolioBrowseSafeIcon';
import { FolioCardStarIcon } from './FolioCardStarIcon';
import { FolioCloseIcon } from './FolioCloseIcon';
import { FolioCompletedSparkIcon } from './FolioCompletedSparkIcon';
import { FolioCreateCardsIcon } from './FolioCreateCardsIcon';
import { FolioDeckAiIcon } from './FolioDeckAiIcon';
import { FolioDeckGeneralIcon } from './FolioDeckGeneralIcon';
import { FolioDeckLanguageIcon } from './FolioDeckLanguageIcon';
import { FolioDeckProgrammingIcon } from './FolioDeckProgrammingIcon';
import { FolioEasyIcon } from './FolioEasyIcon';
import { FolioEditIcon } from './FolioEditIcon';
import { FolioFlipIcon } from './FolioFlipIcon';
import { FolioGoodIcon } from './FolioGoodIcon';
import { FolioHardIcon } from './FolioHardIcon';
import { FolioHelpIcon } from './FolioHelpIcon';
import { FolioNextIcon } from './FolioNextIcon';
import { FolioNotesIcon } from './FolioNotesIcon';
import { FolioPlusIcon } from './FolioPlusIcon';
import { FolioPreviousIcon } from './FolioPreviousIcon';
import { FolioReviewIcon } from './FolioReviewIcon';
import { FolioSaveIcon } from './FolioSaveIcon';
import { FolioSearchIcon } from './FolioSearchIcon';
import { FolioSettingsIcon } from './FolioSettingsIcon';
import { FolioStatsIcon } from './FolioStatsIcon';
import { FolioTrashIcon } from './FolioTrashIcon';
import { FolioUndoIcon } from './FolioUndoIcon';
import type { FolioSvgIconProps } from './types';

export type FolioSvgIconName =
  | 'again'
  | 'back'
  | 'browse-safe'
  | 'card-star'
  | 'close'
  | 'completed-spark'
  | 'create-cards'
  | 'deck-ai'
  | 'deck-general'
  | 'deck-language'
  | 'deck-programming'
  | 'easy'
  | 'edit'
  | 'flip'
  | 'good'
  | 'hard'
  | 'help'
  | 'next'
  | 'notes'
  | 'plus'
  | 'previous'
  | 'review'
  | 'save'
  | 'search'
  | 'settings'
  | 'stats'
  | 'trash'
  | 'undo';

export type FolioSvgIconRouterProps = FolioSvgIconProps & {
  name: FolioSvgIconName;
};

export function FolioSvgIcon({ name, ...props }: FolioSvgIconRouterProps) {
  switch (name) {
    case 'again':
      return <FolioAgainIcon {...props} />;
    case 'back':
      return <FolioBackIcon {...props} />;
    case 'browse-safe':
      return <FolioBrowseSafeIcon {...props} />;
    case 'card-star':
      return <FolioCardStarIcon {...props} />;
    case 'close':
      return <FolioCloseIcon {...props} />;
    case 'completed-spark':
      return <FolioCompletedSparkIcon {...props} />;
    case 'create-cards':
      return <FolioCreateCardsIcon {...props} />;
    case 'deck-ai':
      return <FolioDeckAiIcon {...props} />;
    case 'deck-general':
      return <FolioDeckGeneralIcon {...props} />;
    case 'deck-language':
      return <FolioDeckLanguageIcon {...props} />;
    case 'deck-programming':
      return <FolioDeckProgrammingIcon {...props} />;
    case 'easy':
      return <FolioEasyIcon {...props} />;
    case 'edit':
      return <FolioEditIcon {...props} />;
    case 'flip':
      return <FolioFlipIcon {...props} />;
    case 'good':
      return <FolioGoodIcon {...props} />;
    case 'hard':
      return <FolioHardIcon {...props} />;
    case 'help':
      return <FolioHelpIcon {...props} />;
    case 'next':
      return <FolioNextIcon {...props} />;
    case 'notes':
      return <FolioNotesIcon {...props} />;
    case 'plus':
      return <FolioPlusIcon {...props} />;
    case 'previous':
      return <FolioPreviousIcon {...props} />;
    case 'review':
      return <FolioReviewIcon {...props} />;
    case 'save':
      return <FolioSaveIcon {...props} />;
    case 'search':
      return <FolioSearchIcon {...props} />;
    case 'settings':
      return <FolioSettingsIcon {...props} />;
    case 'stats':
      return <FolioStatsIcon {...props} />;
    case 'trash':
      return <FolioTrashIcon {...props} />;
    case 'undo':
      return <FolioUndoIcon {...props} />;
    default:
      return null;
  }
}
