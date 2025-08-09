import React from 'react';
import { PromptCard as PromptCardType } from '../../../shared';

interface PromptCardProps {
  card: PromptCardType;
}

export const PromptCard: React.FC<PromptCardProps> = ({ card }) => {
  return (
    <div className="p-4">
      <p className="text-gray-800 whitespace-pre-wrap">{card.text}</p>
    </div>
  );
};

export default PromptCard;