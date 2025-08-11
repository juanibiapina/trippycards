import { useAuth } from '@clerk/clerk-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import useYProvider from 'y-partyserver/react';
import * as Y from 'yjs';
import type { Activity, Card } from '../../shared';

interface UseActivityRoomResult {
  activity: Activity | null;
  isConnected: boolean;
  updateName: (name: string) => void;
  updateDates: (startDate: string, endDate?: string, startTime?: string) => void;
  createCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  loading: boolean;
}

export function useActivityRoom(activityId: string | null): UseActivityRoomResult {
  const { getToken } = useAuth();
  const [activity, setActivity] = useState<Activity>({ cards: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create Yjs document with useMemo to prevent recreation
  const yDoc = useMemo(() => new Y.Doc(), []);

  const provider = useYProvider({
    room: activityId || '',
    party: 'activitydo',
    doc: yDoc,
    options: {
      params: async () => ({
        token: await getToken(),
      }),
    },
  });

  // Function to extract activity state from Yjs document
  const extractActivityFromDoc = useCallback((doc: Y.Doc): Activity => {
    const activityMap = doc.getMap('activity');
    const cardsArray = doc.getArray<Y.Map<unknown>>('cards');

    const cards: Card[] = [];
    for (let i = 0; i < cardsArray.length; i++) {
      const cardMap = cardsArray.get(i);
      const card: Record<string, unknown> = {};
      cardMap.forEach((value, key) => {
        card[key] = value;
      });
      cards.push(card as unknown as Card);
    }

    const activity: Activity = { cards };

    if (activityMap.has('name')) {
      activity.name = activityMap.get('name') as string;
    }
    if (activityMap.has('startDate')) {
      activity.startDate = activityMap.get('startDate') as string;
    }
    if (activityMap.has('endDate')) {
      activity.endDate = activityMap.get('endDate') as string;
    }
    if (activityMap.has('startTime')) {
      activity.startTime = activityMap.get('startTime') as string;
    }

    return activity;
  }, []);

  // Setup observers for Yjs document changes
  useEffect(() => {
    if (!provider) return;

    const updateActivity = () => {
      const newActivity = extractActivityFromDoc(yDoc);
      setActivity(newActivity);
      setLoading(false);
    };

    // Initial state update
    updateActivity();

    // Listen for document changes
    const activityMap = yDoc.getMap('activity');
    const cardsArray = yDoc.getArray('cards');

    const activityObserver = () => updateActivity();
    const cardsObserver = () => updateActivity();

    activityMap.observe(activityObserver);
    cardsArray.observe(cardsObserver);

    // Listen for provider connection status
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    provider.on('connect', handleConnect);
    provider.on('disconnect', handleDisconnect);

    return () => {
      activityMap.unobserve(activityObserver);
      cardsArray.unobserve(cardsObserver);
      provider.off('connect', handleConnect);
      provider.off('disconnect', handleDisconnect);
    };
  }, [provider, yDoc, extractActivityFromDoc]);

  const updateName = useCallback((name: string) => {
    yDoc.transact(() => {
      const activityMap = yDoc.getMap('activity');
      activityMap.set('name', name);
    });
  }, [yDoc]);

  const updateDates = useCallback((startDate: string, endDate?: string, startTime?: string) => {
    yDoc.transact(() => {
      const activityMap = yDoc.getMap('activity');
      activityMap.set('startDate', startDate);
      if (endDate !== undefined) {
        activityMap.set('endDate', endDate);
      }
      if (startTime !== undefined) {
        activityMap.set('startTime', startTime);
      }
    });
  }, [yDoc]);

  const createCard = useCallback((card: Card) => {
    yDoc.transact(() => {
      const cardsArray = yDoc.getArray('cards');
      const cardMap = new Y.Map();

      // Set all card properties on the Y.Map
      Object.entries(card).forEach(([key, value]) => {
        cardMap.set(key, value);
      });

      cardsArray.push([cardMap]);
    });
  }, [yDoc]);

  const updateCard = useCallback((updatedCard: Card) => {
    yDoc.transact(() => {
      const cardsArray = yDoc.getArray<Y.Map<unknown>>('cards');

      // Find the card by ID and update it
      for (let i = 0; i < cardsArray.length; i++) {
        const cardMap = cardsArray.get(i);
        if (cardMap.get('id') === updatedCard.id) {
          // Update all properties
          Object.entries(updatedCard).forEach(([key, value]) => {
            cardMap.set(key, value);
          });
          break;
        }
      }
    });
  }, [yDoc]);

  const deleteCard = useCallback((cardId: string) => {
    yDoc.transact(() => {
      const cardsArray = yDoc.getArray<Y.Map<unknown>>('cards');

      // Find and remove the card by ID
      for (let i = 0; i < cardsArray.length; i++) {
        const cardMap = cardsArray.get(i);
        if (cardMap.get('id') === cardId) {
          cardsArray.delete(i);
          break;
        }
      }
    });
  }, [yDoc]);

  return {
    activity,
    isConnected,
    updateName,
    updateDates,
    createCard,
    updateCard,
    deleteCard,
    loading,
  };
}
