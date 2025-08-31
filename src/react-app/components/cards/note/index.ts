import { CardDefinition, CreateActionsFunction } from '../types';
import NoteCard from './NoteCard';
import NoteCardForm from './NoteCardForm';
import type { NoteCard as NoteCardType } from './types';

const createNoteActions: CreateActionsFunction<NoteCardType> = () => ({
  // Note cards currently have no actions
});

export const noteCardDefinition: CardDefinition<NoteCardType> = {
  type: 'note',
  displayName: 'Note',
  description: 'Create a simple text note',
  Component: NoteCard,
  FormComponent: NoteCardForm,
  createActions: createNoteActions,
};

export { NoteCard, NoteCardForm };
export type { NoteCardType };