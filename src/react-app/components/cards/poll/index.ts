import { CardDefinition, CreateActionsFunction } from '../types';
import PollCard from './PollCard';
import PollCardForm from './PollCardForm';
import type { PollCard as PollCardType } from './types';

const createPollActions: CreateActionsFunction<PollCardType> = (card, onUpdateCard) => ({
  vote: (userId: string, optionIdx: number) => {
    const votes = card.votes ? [...card.votes] : [];
    const existing = votes.findIndex(v => v.userId === userId);

    if (existing !== -1) {
      votes[existing] = { userId, option: optionIdx };
    } else {
      votes.push({ userId, option: optionIdx });
    }

    const updatedCard = { ...card, votes };
    onUpdateCard(updatedCard);
  }
});

export const pollCardDefinition: CardDefinition<PollCardType> = {
  type: 'poll',
  displayName: 'Poll',
  description: 'Create a poll with multiple options for voting',
  Component: PollCard,
  FormComponent: PollCardForm,
  createActions: createPollActions,
};

export { PollCard, PollCardForm };
export type { PollCardType };
