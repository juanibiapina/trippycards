import { useState, useCallback } from 'react';
import { usePartySocket } from 'partysocket/react';
import type { Activity, Question, Message } from '../../shared';
import { createEmptyActivity } from '../../shared';

interface UseActivityRoomResult {
  activity: Activity | null;
  isConnected: boolean;
  createQuestion: (text: string, userId: string) => void;
  submitVote: (questionId: string, vote: 'yes' | 'no', userId: string) => void;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  loading: boolean;
}

export function useActivityRoom(activityId: string): UseActivityRoomResult {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const socket = usePartySocket({
    room: activityId,
    party: 'activitydo',
    onOpen: () => {
      setIsConnected(true);
    },
    onClose: () => {
      setIsConnected(false);
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data) as Message;

      if (message.type === 'activity') {
        setActivity(message.activity);
        setLoading(false);
      } else if (message.type === 'question') {
        setActivity(prev => {
          if (!prev) return { ...createEmptyActivity(), questions: { [message.question.id]: message.question } };
          return {
            ...prev,
            questions: {
              ...prev.questions,
              [message.question.id]: message.question,
            },
          };
        });
      } else if (message.type === 'name') {
        setActivity(prev => {
          if (!prev) return { ...createEmptyActivity(), name: message.name };
          return {
            ...prev,
            name: message.name,
          };
        });
      } else if (message.type === 'dates') {
        setActivity(prev => {
          if (!prev) return { ...createEmptyActivity(), startDate: message.startDate, endDate: message.endDate, startTime: message.startTime };
          return {
            ...prev,
            startDate: message.startDate,
            endDate: message.endDate,
            startTime: message.startTime,
          };
        });
      }
    },
  });

  const createQuestion = useCallback((text: string, userId: string) => {
    if (!socket || !isConnected) return;

    const question: Question = {
      id: crypto.randomUUID(),
      text,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      responses: {},
    };

    socket.send(JSON.stringify({
      type: 'question',
      question,
    } satisfies Message));
  }, [socket, isConnected]);

  const submitVote = useCallback((questionId: string, vote: 'yes' | 'no', userId: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'vote',
      questionId,
      vote,
      userId,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateName = useCallback((name: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'name',
      name,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateDates = useCallback((startDate: string, endDate?: string, startTime?: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'dates',
      startDate,
      endDate,
      startTime,
    } satisfies Message));
  }, [socket, isConnected]);

  return {
    activity,
    isConnected,
    createQuestion,
    submitVote,
    updateName,
    updateDates,
    loading,
  };
}
