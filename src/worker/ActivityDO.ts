import { YServer } from "y-partyserver";
import * as Y from "yjs";
import type { Activity, Card } from "../shared";

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
    const cards = this.document.getArray<Y.Map<unknown>>("cards");
    const cardMap = new Y.Map();

    // Set all card properties on the Y.Map
    Object.entries(card).forEach(([key, value]) => {
      cardMap.set(key, value);
    });

    cards.push([cardMap]);
  }

  updateCard(updatedCard: Card) {
    const cards = this.document.getArray<Y.Map<unknown>>("cards");

    // Find the card by ID and update it
    for (let i = 0; i < cards.length; i++) {
      const cardMap = cards.get(i);
      if (cardMap.get("id") === updatedCard.id) {
        // Update all properties
        Object.entries(updatedCard).forEach(([key, value]) => {
          cardMap.set(key, value);
        });
        break;
      }
    }
  }

  deleteCard(cardId: string) {
    const cards = this.document.getArray<Y.Map<unknown>>("cards");

    // Find and remove the card by ID
    for (let i = 0; i < cards.length; i++) {
      const cardMap = cards.get(i);
      if (cardMap.get("id") === cardId) {
        cards.delete(i);
        break;
      }
    }
  }

  updateName(name: string) {
    const activity = this.document.getMap<unknown>("activity");
    activity.set("name", name);
  }

  updateDates(startDate: string, endDate?: string, startTime?: string) {
    const activity = this.document.getMap<unknown>("activity");
    activity.set("startDate", startDate);
    if (endDate !== undefined) {
      activity.set("endDate", endDate);
    }
    if (startTime !== undefined) {
      activity.set("startTime", startTime);
    }
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
        card[key] = value;
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
