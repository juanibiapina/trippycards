import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, LinkCard as LinkCardType, PollCard as PollCardType, NoteCard as NoteCardType } from '../../../shared';
import LinkCard from './LinkCard';
import CardComponent from '../Card';
import PollCard from './PollCard';
import NoteCard from './NoteCard';

interface CardsListProps {
  cards: Card[];
  userId: string;
  onUpdateCard: (card: PollCardType) => void;
  onDeleteCard: (cardId: string) => void;
  onReorderCards?: (cards: Card[]) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, userId, onUpdateCard, onReorderCards }) => {
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleCardClick = (cardId: string) => {
    navigate(`/activities/${params.activityId}/cards/${cardId}`);
  };

  // Keep cards in original order for manual sorting
  const displayedCards = cards;

  const handleDragStart = (_e: React.DragEvent, card: Card) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedCard || !onReorderCards) return;

    const dragIndex = cards.findIndex(card => card.id === draggedCard.id);
    if (dragIndex === dropIndex) return;

    const newCards = [...cards];
    // Remove dragged item and insert at new position
    const [draggedItem] = newCards.splice(dragIndex, 1);
    newCards.splice(dropIndex, 0, draggedItem);

    onReorderCards(newCards);
    setDraggedCard(null);
    setDragOverIndex(null);
  };

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
      {displayedCards.map((card, index) => {
        const canDrag = true;
        const isBeingDraggedOver = dragOverIndex === index;

        const cardElement = (
          <div
            key={card.id}
            draggable={canDrag}
            onDragStart={(e) => handleDragStart(e, card)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              ${canDrag ? 'cursor-move' : ''}
              ${isBeingDraggedOver ? 'border-t-2 border-blue-500' : ''}
              ${card.date ? 'relative' : ''}
            `}
          >
            {/* Date indicator for cards with dates */}
            {card.date && (
              <div className="mb-2 text-xs text-gray-500">
                {new Date(card.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            )}

            <CardComponent onClick={() => handleCardClick(card.id)}>
                {card.type === 'link' && <LinkCard card={card as LinkCardType} />}
                {card.type === 'poll' && (
                  <PollCard
                    card={card as PollCardType}
                    userId={userId}
                    onVote={(optionIdx: number) => {
                      const pollCard = card as PollCardType;
                      const votes = pollCard.votes ? [...pollCard.votes] : [];
                      const existing = votes.findIndex(v => v.userId === userId);
                      if (existing !== -1) {
                        votes[existing] = { userId, option: optionIdx };
                      } else {
                        votes.push({ userId, option: optionIdx });
                      }
                      onUpdateCard({ ...(card as PollCardType), votes });
                    }}
                  />
                )}
                {card.type === 'note' && <NoteCard card={card as NoteCardType} />}
                {!['link', 'poll', 'note'].includes(card.type) && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="text-gray-600">Unknown card type: {card.type}</p>
                  </div>
                )}
              </CardComponent>
          </div>
        );

        return cardElement;
      })}
    </div>
  );
};

export default CardsList;