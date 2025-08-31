import React from 'react';
import type { NoteCard as NoteCardType } from './types';
import { BaseCardProps } from '../types';

export const NoteCard: React.FC<BaseCardProps<NoteCardType>> = ({ card }) => {
  return (
    <div className="space-y-3">
      <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
        {card.text}
      </div>
    </div>
  );
};

export default NoteCard;