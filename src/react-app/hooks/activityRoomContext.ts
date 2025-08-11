import { createContext } from 'react';
import type { Activity, Card } from '../../shared';

export interface ActivityRoomContextType {
  activity: Activity | null;
  isConnected: boolean;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  loading: boolean;
}

export const ActivityRoomContext = createContext<ActivityRoomContextType | null>(null);