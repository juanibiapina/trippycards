import { CardDefinition, CreateActionsFunction } from '../types';
import LinkCard from './LinkCard';
import LinkCardForm from './LinkCardForm';
import type { LinkCard as LinkCardType } from './types';

const createLinkActions: CreateActionsFunction<LinkCardType> = () => ({
  // Link cards currently have no actions
});

export const linkCardDefinition: CardDefinition<LinkCardType> = {
  type: 'link',
  displayName: 'Link',
  description: 'Share a link with title, description, and preview image',
  Component: LinkCard,
  FormComponent: LinkCardForm,
  createActions: createLinkActions,
};

export { LinkCard, LinkCardForm };
export type { LinkCardType };
