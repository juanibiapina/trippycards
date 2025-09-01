import { Card } from '../../../../shared';

export interface CarCard extends Card {
  type: 'car';
  title: string;
  seats: number;
  occupants?: { userId: string; seatIndex: number }[];
}