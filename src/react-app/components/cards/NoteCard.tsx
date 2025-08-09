import React from 'react';
import { NoteCard as NoteCardType } from '../../../shared';

interface NoteCardProps {
  card: NoteCardType;
}

export const NoteCard: React.FC<NoteCardProps> = ({ card }) => {
  return (
    <div className="p-4">
      <p className="text-gray-800 whitespace-pre-wrap">{card.text}</p>
    </div>
  );
};

export default NoteCard;