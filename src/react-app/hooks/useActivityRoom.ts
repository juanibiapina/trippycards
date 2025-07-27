import { useState, useCallback } from 'react';
import { usePartySocket } from 'partysocket/react';
import type { Activity, Message, Card } from '../../shared';
import { createEmptyActivity } from '../../shared';

interface UseActivityRoomResult {
  activity: Activity | null;
  isConnected: boolean;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  addUser: (user: { userId: string; name?: string }) => void;
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
      } else if (message.type === 'card-create') {
        setActivity(prev => {
          if (!prev) return { ...createEmptyActivity(), cards: [message.card] };
          return {
            ...prev,
            cards: [...(prev.cards || []), message.card],
          };
        });
      } else if (message.type === 'card-update') {
        setActivity(prev => {
          if (!prev) return createEmptyActivity();
          return {
            ...prev,
            cards: (prev.cards || []).map(card =>
              card.id === message.card.id ? message.card : card
            ),
          };
        });
      } else if (message.type === 'card-delete') {
        setActivity(prev => {
          if (!prev) return createEmptyActivity();
          return {
            ...prev,
            cards: (prev.cards || []).filter(card => card.id !== message.cardId),
          };
        });
      } else if (message.type === 'user-add') {
        setActivity(prev => {
          if (!prev) return { ...createEmptyActivity(), users: [message.user] };
          const users = prev.users || [];
          const existingIndex = users.findIndex(u => u.userId === message.user.userId);
          const newUsers = existingIndex !== -1
            ? users.map((u, i) => i === existingIndex ? message.user : u)
            : [...users, message.user];
          return {
            ...prev,
            users: newUsers,
          };
        });
      }
    },
  });



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

  const createCard = useCallback((card: Card) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-create',
      card,
    } satisfies Message));
  }, [socket, isConnected]);

  const updateCard = useCallback((card: Card) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-update',
      card,
    } satisfies Message));
  }, [socket, isConnected]);

  const deleteCard = useCallback((cardId: string) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'card-delete',
      cardId,
    } satisfies Message));
  }, [socket, isConnected]);

  const addUser = useCallback((user: { userId: string; name?: string }) => {
    if (!socket || !isConnected) return;

    socket.send(JSON.stringify({
      type: 'user-add',
      user,
    } satisfies Message));
  }, [socket, isConnected]);

  return {
    activity,
    isConnected,
    updateName,
    updateDates,
    createCard,
    updateCard,
    deleteCard,
    addUser,
    loading,
  };
}
