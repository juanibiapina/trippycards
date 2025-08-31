import { Card } from '../../../../shared';

export interface PollCard extends Card {
  type: 'poll';
  question: string;
  options: string[];
  votes?: { userId: string; option: number }[];
}