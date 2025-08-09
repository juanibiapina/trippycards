import { createContext, useContext, ReactNode } from 'react';
import type { Activity, Card } from '../../shared';

interface ActivityRoomContextType {
  activity: Activity | null;
  isConnected: boolean;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  loading: boolean;
}

const ActivityRoomContext = createContext<ActivityRoomContextType | null>(null);

export const useActivityRoomContext = () => {
  const context = useContext(ActivityRoomContext);
  if (!context) {
    throw new Error('useActivityRoomContext must be used within an ActivityRoomProvider');
  }
  return context;
};

export const ActivityRoomProvider = ({ children, value }: { children: ReactNode; value: ActivityRoomContextType }) => {
  return (
    <ActivityRoomContext.Provider value={value}>
      {children}
    </ActivityRoomContext.Provider>
  );
};