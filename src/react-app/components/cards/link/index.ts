import { LinkCard as LinkCardType, LinkCardInput } from '../../../../shared';
import { CardDefinition } from '../types';
import LinkCard from './LinkCard';
import LinkCardForm from './LinkCardForm';

export const linkCardDefinition: CardDefinition<LinkCardType, LinkCardInput> = {
  type: 'link',
  displayName: 'Link',
  Component: LinkCard,
  FormComponent: LinkCardForm,
  description: 'Share a link with title, description, and preview image'
};

export { LinkCard, LinkCardForm };