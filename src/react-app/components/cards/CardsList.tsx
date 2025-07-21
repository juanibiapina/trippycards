import React from 'react';
import { Card, LinkCard as LinkCardType, PollCard as PollCardType } from '../../../shared';
import LinkCard from './LinkCard';
import CardComponent from '../Card';
import CardContextMenu from './CardContextMenu';
import PollCard from './PollCard';

interface CardsListProps {
  cards: Card[];
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, onEditCard, onDeleteCard }) => {
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
            return (
              <CardComponent key={card.id}>
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <CardContextMenu
                      onEdit={() => onEditCard(card)}
                      onDelete={() => onDeleteCard(card)}
                    />
                  </div>
                  <LinkCard card={card as LinkCardType} />
                </div>
              </CardComponent>
            );
          case 'poll':
            return (
              <CardComponent key={card.id}>
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <CardContextMenu
                      onEdit={() => onEditCard(card)}
                      onDelete={() => onDeleteCard(card)}
                    />
                  </div>
                  <PollCard card={card as PollCardType} />
                </div>
              </CardComponent>
            );
          default:
            return (
              <CardComponent key={card.id}>
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <CardContextMenu
                      onEdit={() => onEditCard(card)}
                      onDelete={() => onDeleteCard(card)}
                    />
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="text-gray-600">Unknown card type: {card.type}</p>
                  </div>
                </div>
              </CardComponent>
            );
        }
      })}
    </div>
  );
};

export default CardsList;