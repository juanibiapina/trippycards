import { CardDefinition } from './types';
import { linkCardDefinition } from './link';
import { pollCardDefinition } from './poll';
import { noteCardDefinition } from './note';

// Registry of all card definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardDefinitions: CardDefinition<any>[] = [
  linkCardDefinition,
  pollCardDefinition,
  noteCardDefinition
];

// Get a specific card definition by type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCardDefinition = (type: string): CardDefinition<any> | undefined => {
  return cardDefinitions.find(def => def.type === type);
};

// Get all available card definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllCardDefinitions = (): CardDefinition<any>[] => {
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