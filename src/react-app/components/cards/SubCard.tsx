import React from 'react';
import { Card as CardType, LinkCard, PollCard, NoteCard } from '../../../shared';
import { useLongPress } from '../../hooks/useLongPress';
import LinkCardComponent from './LinkCard';
import PollCardComponent from './PollCard';
import NoteCardComponent from './NoteCard';

interface SubCardProps {
  subcard: CardType;
  userId: string;
  onDeleteSubcard: (subcardId: string) => void;
  onUpdateCard: (updatedCard: CardType) => void;
  parentCard: CardType;
}

const SubCard: React.FC<SubCardProps> = ({ subcard, userId, onDeleteSubcard, onUpdateCard, parentCard }) => {
  const handleLongPress = () => {
    onDeleteSubcard(subcard.id);
  };

  const subcardLongPress = useLongPress(handleLongPress);

  return (
    <div
      className="bg-white rounded-lg shadow p-6"
      {...subcardLongPress}
    >
      {subcard.type === 'link' && <LinkCardComponent card={subcard as LinkCard} />}
      {subcard.type === 'poll' && (
        <PollCardComponent
          card={subcard as PollCard}
          userId={userId}
          onVote={(optionIdx: number) => {
            const pollSubcard = subcard as PollCard;
            const votes = pollSubcard.votes ? [...pollSubcard.votes] : [];
            const existing = votes.findIndex(v => v.userId === userId);
            if (existing !== -1) {
              votes[existing] = { userId, option: optionIdx };
            } else {
              votes.push({ userId, option: optionIdx });
            }

            // Update subcard in parent's children array
            const updatedCard: CardType = {
              ...parentCard,
              children: parentCard.children?.map(c =>
                c.id === subcard.id ? { ...pollSubcard, votes } as CardType : c
              ),
              updatedAt: new Date().toISOString(),
            };
            onUpdateCard(updatedCard);
          }}
        />
      )}
      {subcard.type === 'note' && <NoteCardComponent card={subcard as NoteCard} />}
    </div>
  );
};

export default SubCard;