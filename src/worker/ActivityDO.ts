import { YServer } from "y-partyserver";
import * as Y from "yjs";
import type { Activity, Card, AILinkCard } from "../shared";
import type { Env } from "./index";

export class ActivityDO extends YServer<Env> {
  static options = { hibernate: true };

  /**
   * Public API - Use this class by getting a stub and calling methods directly:
   *
   * Example usage:
   *   const activityId = "some-activity-id";
   *   const stub = env.ACTIVITYDO.idFromString(activityId).get(ActivityDO);
   *   await stub.addCard(newCard);
   *   await stub.updateName("New Activity Name");
   *
   * All changes automatically propagate to connected clients via Yjs sync protocol.
   */

  addCard(card: Card) {
    this.document.transact(() => {
      const cards = this.document.getArray<Y.Map<unknown>>("cards");
      const cardMap = new Y.Map();

      // Trigger workflow for AILink cards
      if (card.type === 'ailink') {
        const id = crypto.randomUUID();
        // Start workflow asynchronously - don't await to avoid blocking Yjs transaction
        this.env.AILINK_WORKFLOW.create({
          id,
          params: {
            cardId: card.id,
            url: (card as AILinkCard).url,
            durableObjectId: this.ctx.id.toString()
          }
        }).then(() => {
          console.log(`AILink workflow ${id} started for card ${card.id}`);
        }).catch((error) => {
          console.error(`Failed to start AILink workflow for card ${card.id}:`, error);
        });

        // Add the workflow id to the card
        (card as AILinkCard).workflowId = id;
      }

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

      cards.push([cardMap]);
    });
  }

  updateCard(updatedCard: Card) {
    this.document.transact(() => {
      const cards = this.document.getArray<Y.Map<unknown>>("cards");

      // Find the card by ID and update it
      for (let i = 0; i < cards.length; i++) {
        const cardMap = cards.get(i);
        if (cardMap.get("id") === updatedCard.id) {
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
  }

  deleteCard(cardId: string) {
    this.document.transact(() => {
      const cards = this.document.getArray<Y.Map<unknown>>("cards");

      // Find and remove the card by ID
      for (let i = 0; i < cards.length; i++) {
        const cardMap = cards.get(i);
        if (cardMap.get("id") === cardId) {
          cards.delete(i);
          break;
        }
      }
    });
  }

  updateCardFields(cardId: string, updates: Partial<Record<string, unknown>>) {
    this.document.transact(() => {
      const cards = this.document.getArray<Y.Map<unknown>>("cards");

      // Find the card by ID and update specific fields
      for (let i = 0; i < cards.length; i++) {
        const cardMap = cards.get(i);
        if (cardMap.get("id") === cardId) {
          // Update only the specified fields
          Object.entries(updates).forEach(([key, value]) => {
            cardMap.set(key, value);
          });
          // Always update the updatedAt timestamp
          cardMap.set("updatedAt", new Date().toISOString());
          break;
        }
      }
    });
  }

  updateName(name: string) {
    this.document.transact(() => {
      const activity = this.document.getMap<unknown>("activity");
      activity.set("name", name);
    });
  }

  updateDates(startDate: string, endDate?: string, startTime?: string) {
    this.document.transact(() => {
      const activity = this.document.getMap<unknown>("activity");
      activity.set("startDate", startDate);
      if (endDate !== undefined) {
        activity.set("endDate", endDate);
      }
      if (startTime !== undefined) {
        activity.set("startTime", startTime);
      }
    });
  }

  // Lifecycle methods for persistence

  async onLoad() {
    // Load the persisted Yjs document state from Durable Object storage
    const savedState = await this.ctx.storage.get<Uint8Array>("yjs-state");
    if (savedState) {
      Y.applyUpdate(this.document, savedState);
    } else {
      // Initialize empty structure if no saved state
      this.document.getMap("activity");
      this.document.getArray("cards");
    }
  }

  async onSave() {
    // Save the current Yjs document state to Durable Object storage
    const state = Y.encodeStateAsUpdate(this.document);
    await this.ctx.storage.put("yjs-state", state);
  }

  async onRequest(request: Request) {
    if (request.method === "GET") {
      // Return the current activity state for direct API access
      const activity = this.getActivityState();
      return new Response(JSON.stringify(activity), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Method not allowed", { status: 405 });
  }

  // Helper method to extract current state from Yjs document
  private getActivityState(): Activity {
    const activityMap = this.document.getMap("activity");
    const cardsArray = this.document.getArray<Y.Map<unknown>>("cards");

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

    const activity: Activity = {
      cards,
    };

    if (activityMap.has("name")) {
      activity.name = activityMap.get("name") as string;
    }
    if (activityMap.has("startDate")) {
      activity.startDate = activityMap.get("startDate") as string;
    }
    if (activityMap.has("endDate")) {
      activity.endDate = activityMap.get("endDate") as string;
    }
    if (activityMap.has("startTime")) {
      activity.startTime = activityMap.get("startTime") as string;
    }

    return activity;
  }
}
