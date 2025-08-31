import { PollCard as PollCardType, PollCardInput } from '../../../../shared';
import { CardDefinition } from '../types';
import PollCard from './PollCard';
import PollCardForm from './PollCardForm';

export const pollCardDefinition: CardDefinition<PollCardType, PollCardInput> = {
  type: 'poll',
  displayName: 'Poll',
  Component: PollCard,
  FormComponent: PollCardForm,
  description: 'Create a poll with multiple options for voting'
};

export { PollCard, PollCardForm };