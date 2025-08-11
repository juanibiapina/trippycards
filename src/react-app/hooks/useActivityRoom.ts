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
  const { getToken, isLoaded } = useAuth();
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
      params: async () => {
        try {
          // Only attempt to get token if Clerk is loaded
          if (isLoaded) {
            return { token: await getToken() };
          } else {
            // Return empty params if Clerk is not loaded yet
            return {};
          }
        } catch (error) {
          console.warn('Failed to get auth token:', error);
          // Return empty params on auth failure to allow connection without authentication
          return {};
        }
      },
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
        if (key === 'children' && value instanceof Y.Array) {
          // Extract children from Y.Array
          const childrenArray: Card[] = [];
          const childrenYArray = value as Y.Array<Y.Map<unknown>>;
          for (let j = 0; j < childrenYArray.length; j++) {
            const childMap = childrenYArray.get(j);
            const childCard: Record<string, unknown> = {};
            childMap.forEach((childValue, childKey) => {
              if (childKey === 'children' && childValue instanceof Y.Array) {
                // Handle nested children recursively
                const nestedChildrenArray: Card[] = [];
                const nestedChildrenYArray = childValue as Y.Array<Y.Map<unknown>>;
                for (let k = 0; k < nestedChildrenYArray.length; k++) {
                  const nestedChildMap = nestedChildrenYArray.get(k);
                  const nestedChildCard: Record<string, unknown> = {};
                  nestedChildMap.forEach((nestedValue, nestedKey) => {
                    nestedChildCard[nestedKey] = nestedValue;
                  });
                  nestedChildrenArray.push(nestedChildCard as unknown as Card);
                }
                childCard[childKey] = nestedChildrenArray;
              } else {
                childCard[childKey] = childValue;
              }
            });
            childrenArray.push(childCard as unknown as Card);
          }
          card[key] = childrenArray;
        } else {
          card[key] = value;
        }
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

    // Set up observers for children arrays within cards
    const setupCardChildrenObservers = () => {
      for (let i = 0; i < cardsArray.length; i++) {
        const cardMap = cardsArray.get(i);
        if (cardMap instanceof Y.Map) {
          // Observe the card map itself for changes to its properties
          cardMap.observe(updateActivity);

          const children = cardMap.get('children');
          if (children instanceof Y.Array) {
            children.observe(updateActivity);

            // Also observe each child map for property changes
            for (let j = 0; j < children.length; j++) {
              const childMap = children.get(j);
              if (childMap instanceof Y.Map) {
                childMap.observe(updateActivity);

                const nestedChildren = childMap.get('children');
                if (nestedChildren instanceof Y.Array) {
                  nestedChildren.observe(updateActivity);

                  // Observe nested child maps too
                  for (let k = 0; k < nestedChildren.length; k++) {
                    const nestedChildMap = nestedChildren.get(k);
                    if (nestedChildMap instanceof Y.Map) {
                      nestedChildMap.observe(updateActivity);
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    // Enhanced cards observer that also sets up children observers
    const enhancedCardsObserver = () => {
      updateActivity();
      setupCardChildrenObservers();
    };

    activityMap.observe(activityObserver);
    cardsArray.observe(enhancedCardsObserver);

    // Initial setup of children observers
    setupCardChildrenObservers();

    // Check initial connection state and set up periodic check
    const checkConnection = () => {
      if (provider.ws && provider.ws.readyState === WebSocket.OPEN) {
        setIsConnected(prev => {
          if (!prev) {
            console.log('Provider connected');
          }
          return true;
        });
      } else {
        setIsConnected(prev => {
          if (prev) {
            console.log('Provider disconnected');
          }
          return false;
        });
      }
    };

    // Initial check
    checkConnection();

    // Periodic check every 1000ms
    const connectionCheckInterval = setInterval(checkConnection, 1000);

    // Also listen for provider events if they exist
    const handleConnectEvent = () => {
      console.log('Provider connected via event');
      setIsConnected(true);
    };
    const handleDisconnectEvent = () => {
      console.log('Provider disconnected via event');
      setIsConnected(false);
    };

    // Try to listen for events
    try {
      provider.on('connect', handleConnectEvent);
      provider.on('disconnect', handleDisconnectEvent);
      provider.on('open', handleConnectEvent);
      provider.on('close', handleDisconnectEvent);
    } catch {
      // Provider events not available, rely on periodic check
    }

    return () => {
      clearInterval(connectionCheckInterval);
      activityMap.unobserve(activityObserver);
      cardsArray.unobserve(enhancedCardsObserver);

      // Clean up children observers
      for (let i = 0; i < cardsArray.length; i++) {
        const cardMap = cardsArray.get(i);
        if (cardMap instanceof Y.Map) {
          // Unobserve the card map itself
          cardMap.unobserve(updateActivity);

          const children = cardMap.get('children');
          if (children instanceof Y.Array) {
            children.unobserve(updateActivity);

            // Clean up child map observers
            for (let j = 0; j < children.length; j++) {
              const childMap = children.get(j);
              if (childMap instanceof Y.Map) {
                childMap.unobserve(updateActivity);

                const nestedChildren = childMap.get('children');
                if (nestedChildren instanceof Y.Array) {
                  nestedChildren.unobserve(updateActivity);

                  // Clean up nested child map observers
                  for (let k = 0; k < nestedChildren.length; k++) {
                    const nestedChildMap = nestedChildren.get(k);
                    if (nestedChildMap instanceof Y.Map) {
                      nestedChildMap.unobserve(updateActivity);
                    }
                  }
                }
              }
            }
          }
        }
      }

      try {
        provider.off('connect', handleConnectEvent);
        provider.off('disconnect', handleDisconnectEvent);
        provider.off('open', handleConnectEvent);
        provider.off('close', handleDisconnectEvent);
      } catch {
        // Ignore cleanup errors
      }
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

      // Set all card properties on the Y.Map, handling children specially
      Object.entries(card).forEach(([key, value]) => {
        if (key === 'children' && Array.isArray(value)) {
          // Create a Y.Array for children
          const childrenArray = new Y.Array();
          value.forEach(childCard => {
            const childMap = new Y.Map();
            Object.entries(childCard).forEach(([childKey, childValue]) => {
              if (childKey === 'children' && Array.isArray(childValue)) {
                // Handle nested children recursively if needed
                const nestedChildrenArray = new Y.Array();
                childValue.forEach(nestedCard => {
                  const nestedMap = new Y.Map();
                  Object.entries(nestedCard).forEach(([nestedKey, nestedValue]) => {
                    nestedMap.set(nestedKey, nestedValue);
                  });
                  nestedChildrenArray.push([nestedMap]);
                });
                childMap.set(childKey, nestedChildrenArray);
              } else {
                childMap.set(childKey, childValue);
              }
            });
            childrenArray.push([childMap]);
          });
          cardMap.set(key, childrenArray);
        } else {
          cardMap.set(key, value);
        }
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
          // Update all properties, handling children specially
          Object.entries(updatedCard).forEach(([key, value]) => {
            if (key === 'children' && Array.isArray(value)) {
              // Replace the existing children array with a new Y.Array
              const childrenArray = new Y.Array();
              value.forEach(childCard => {
                const childMap = new Y.Map();
                Object.entries(childCard).forEach(([childKey, childValue]) => {
                  if (childKey === 'children' && Array.isArray(childValue)) {
                    // Handle nested children recursively if needed
                    const nestedChildrenArray = new Y.Array();
                    childValue.forEach(nestedCard => {
                      const nestedMap = new Y.Map();
                      Object.entries(nestedCard).forEach(([nestedKey, nestedValue]) => {
                        nestedMap.set(nestedKey, nestedValue);
                      });
                      nestedChildrenArray.push([nestedMap]);
                    });
                    childMap.set(childKey, nestedChildrenArray);
                  } else {
                    childMap.set(childKey, childValue);
                  }
                });
                childrenArray.push([childMap]);
              });
              cardMap.set(key, childrenArray);
            } else {
              cardMap.set(key, value);
            }
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
