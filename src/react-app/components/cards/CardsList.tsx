import React from 'react';
import { Card, LinkCard as LinkCardType } from '../../../shared';
import LinkCard from './LinkCard';

interface CardsListProps {
  cards: Card[];
}

export const CardsList: React.FC<CardsListProps> = ({ cards }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No cards yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first card to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => {
        switch (card.type) {
          case 'link':
            return <LinkCard key={card.id} card={card as LinkCardType} />;
          default:
            return (
              <div key={card.id} className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-600">Unknown card type: {card.type}</p>
              </div>
            );
        }
      })}
    </div>
  );
};

export default CardsList;