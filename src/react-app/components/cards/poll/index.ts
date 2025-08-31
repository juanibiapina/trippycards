import { CardDefinition } from '../types';
import PollCard from './PollCard';
import PollCardForm from './PollCardForm';
import type { PollCard as PollCardType } from './types';

export const pollCardDefinition: CardDefinition<PollCardType> = {
  type: 'poll',
  displayName: 'Poll',
  Component: PollCard,
  FormComponent: PollCardForm,
  description: 'Create a poll with multiple options for voting'
};

export { PollCard, PollCardForm };
export type { PollCardType };