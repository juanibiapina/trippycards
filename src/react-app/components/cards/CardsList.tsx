import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, LinkCard as LinkCardType, PollCard as PollCardType, NoteCard as NoteCardType, AILinkCard as AILinkCardType } from '../../../shared';
import LinkCard from './LinkCard';
import CardComponent from '../Card';
import PollCard from './PollCard';
import NoteCard from './NoteCard';
import AILinkCard from './AILinkCard';
import { useLongPress } from '../../hooks/useLongPress';

interface CardsListProps {
  cards: Card[];
  userId: string;
  onUpdateCard: (card: PollCardType) => void;
  onDeleteCard: (cardId: string) => void;
}

interface CardListItemProps {
  card: Card;
  userId: string;
  onUpdateCard: (card: PollCardType) => void;
  onCardClick: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

const CardListItem: React.FC<CardListItemProps> = ({ card, userId, onUpdateCard, onCardClick, onDeleteCard }) => {
  const handleLongPress = () => {
    if (confirm('Are you sure you want to delete this card?')) {
      onDeleteCard(card.id);
    }
  };

  const longPressProps = useLongPress(handleLongPress);

  return (
    <div
      className={`${card.date ? 'relative' : ''}`}
      {...longPressProps}
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

      <CardComponent onClick={() => onCardClick(card.id)}>
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
        {card.type === 'ailink' && <AILinkCard card={card as AILinkCardType} />}
        {!['link', 'poll', 'note', 'ailink'].includes(card.type) && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-600">Unknown card type: {card.type}</p>
          </div>
        )}
      </CardComponent>
    </div>
  );
};

export const CardsList: React.FC<CardsListProps> = ({ cards, userId, onUpdateCard, onDeleteCard }) => {
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();

  const handleCardClick = (cardId: string) => {
    navigate(`/activities/${params.activityId}/cards/${cardId}`);
  };

  // Keep cards in original order
  const displayedCards = cards;

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
      {displayedCards.map((card) => (
        <CardListItem
          key={card.id}
          card={card}
          userId={userId}
          onUpdateCard={onUpdateCard}
          onCardClick={handleCardClick}
          onDeleteCard={onDeleteCard}
        />
      ))}
    </div>
  );
};

export default CardsList;