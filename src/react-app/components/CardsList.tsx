import React from 'react';
import { Card } from '../../shared';
import CardWrapper from './CardWrapper';
import { getCardDefinition } from './cards/registry';

interface CardsListProps {
  cards: Card[];
  userId: string;
  onUpdateCard: (card: Card) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, userId, onUpdateCard }) => {
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
        const cardDefinition = getCardDefinition(card.type);

        if (cardDefinition) {
          const { Component } = cardDefinition;
          return (
            <CardWrapper key={card.id}>
              <Component
                card={card}
                userId={userId}
                onUpdateCard={onUpdateCard}
              />
            </CardWrapper>
          );
        }

        // Fallback for unknown card types
        return (
          <CardWrapper key={card.id}>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">Unknown card type: {card.type}</p>
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default CardsList;
