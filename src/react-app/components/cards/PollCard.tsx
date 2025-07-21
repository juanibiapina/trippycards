import React from 'react';
import { PollCard as PollCardType } from '../../../shared';

interface PollCardProps {
  card: PollCardType;
}

const PollCard: React.FC<PollCardProps> = ({ card }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {card.question}
      </h3>
      <ul className="space-y-2">
        {card.options.map((option, idx) => (
          <li key={idx} className="p-2 bg-gray-100 rounded text-gray-800">
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollCard;