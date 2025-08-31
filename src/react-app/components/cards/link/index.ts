import { CardDefinition } from '../types';
import LinkCard from './LinkCard';
import LinkCardForm from './LinkCardForm';
import type { LinkCard as LinkCardType } from './types';

export const linkCardDefinition: CardDefinition<LinkCardType> = {
  type: 'link',
  displayName: 'Link',
  description: 'Share a link with title, description, and preview image',
  Component: LinkCard,
  FormComponent: LinkCardForm,
};

export { LinkCard, LinkCardForm };
export type { LinkCardType };
