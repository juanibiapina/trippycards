import { CardDefinition, CardActionHandler } from '../types';
import PollCard from './PollCard';
import PollCardForm from './PollCardForm';
import type { PollCard as PollCardType } from './types';

const pollActionHandler: CardActionHandler<PollCardType> = (card, action) => {
  if (action.type === 'vote') {
    const { userId, optionIdx } = action.payload as { userId: string; optionIdx: number };
    const votes = card.votes ? [...card.votes] : [];
    const existing = votes.findIndex(v => v.userId === userId);

    if (existing !== -1) {
      votes[existing] = { userId, option: optionIdx };
    } else {
      votes.push({ userId, option: optionIdx });
    }

    return { ...card, votes };
  }

  return card;
};

export const pollCardDefinition: CardDefinition<PollCardType> = {
  type: 'poll',
  displayName: 'Poll',
  description: 'Create a poll with multiple options for voting',
  Component: PollCard,
  FormComponent: PollCardForm,
  actionHandler: pollActionHandler,
};

export { PollCard, PollCardForm };
export type { PollCardType };
