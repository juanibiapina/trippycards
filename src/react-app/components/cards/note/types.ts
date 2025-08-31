import { Card } from '../../../../shared';

export interface NoteCard extends Card {
  type: 'note';
  text: string;
}