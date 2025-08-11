import { ReactNode } from 'react';
import { ActivityRoomContext, ActivityRoomContextType } from './activityRoomContext';

export const ActivityRoomProvider = ({ children, value }: { children: ReactNode; value: ActivityRoomContextType }) => {
  return (
    <ActivityRoomContext.Provider value={value}>
      {children}
    </ActivityRoomContext.Provider>
  );
};