import { CardDefinition } from './types';
import { linkCardDefinition } from './link';
import { pollCardDefinition } from './poll';

// Registry of all card definitions
const cardDefinitions: CardDefinition<any, any>[] = [
  linkCardDefinition,
  pollCardDefinition
];

// Get a specific card definition by type
export const getCardDefinition = (type: string): CardDefinition<any, any> | undefined => {
  return cardDefinitions.find(def => def.type === type);
};

// Get all available card definitions
export const getAllCardDefinitions = (): CardDefinition<any, any>[] => {
  return cardDefinitions;
};

// Get display name for a card type
export const getCardDisplayName = (type: string): string => {
  const definition = getCardDefinition(type);
  return definition?.displayName || type;
};

// Get all available card types
export const getAvailableCardTypes = (): string[] => {
  return cardDefinitions.map(def => def.type);
};