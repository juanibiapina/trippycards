import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, LinkCard as LinkCardType, PollCard as PollCardType, PromptCard as PromptCardType } from '../../../shared';
import LinkCard from './LinkCard';
import CardComponent from '../Card';
import PollCard from './PollCard';
import PromptCard from './PromptCard';

interface CardsListProps {
  cards: Card[];
  userId: string;
  onUpdateCard: (card: PollCardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export const CardsList: React.FC<CardsListProps> = ({ cards, userId, onUpdateCard }) => {
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();

  const handleCardClick = (cardId: string) => {
    navigate(`/activities/${params.activityId}/cards/${cardId}`);
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
      {cards.map((card) => {
        switch (card.type) {
          case 'link':
            return (
              <CardComponent key={card.id} onClick={() => handleCardClick(card.id)}>
                <LinkCard card={card as LinkCardType} />
              </CardComponent>
            );
          case 'poll':
            return (
              <CardComponent key={card.id} onClick={() => handleCardClick(card.id)}>
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
              </CardComponent>
            );
          case 'prompt':
            return (
              <CardComponent key={card.id} onClick={() => handleCardClick(card.id)}>
                <PromptCard card={card as PromptCardType} />
              </CardComponent>
            );
          default:
            return (
              <CardComponent key={card.id} onClick={() => handleCardClick(card.id)}>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-gray-600">Unknown card type: {card.type}</p>
                </div>
              </CardComponent>
            );
        }
      })}
    </div>
  );
};

export default CardsList;