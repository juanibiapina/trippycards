import { useContext } from 'react';
import { ActivityRoomContext } from './activityRoomContext';

export const useActivityRoomContext = () => {
  const context = useContext(ActivityRoomContext);
  if (!context) {
    throw new Error('useActivityRoomContext must be used within an ActivityRoomProvider');
  }
  return context;
};