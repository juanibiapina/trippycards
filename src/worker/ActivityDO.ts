import {
  type Connection,
  Server,
  type WSMessage,
} from "partyserver";

import type { Activity, Message, Card } from "../shared";

export class ActivityDO extends Server<Env> {
  static options = { hibernate: true };

  private activity: Activity = {};

  /**
   * Public API - Use this class by getting a stub and calling methods directly:
   *
   * Example usage:
   *   const activityId = "some-activity-id";
   *   const stub = env.ACTIVITYDO.idFromString(activityId).get(ActivityDO);
   *   await stub.addCard(newCard);
   *   await stub.updateName("New Activity Name");
   *
   * All method calls automatically propagate updates to connected WebSocket clients
   * via the internal broadcast mechanism.
   */

  async addCard(card: Card) {
    if (!this.activity.cards) {
      this.activity.cards = [];
    }
    this.activity.cards.push(card);
    await this.ctx.storage.put("activity", this.activity);
  }

  async updateCard(updatedCard: Card) {
    if (!this.activity.cards) {
      this.activity.cards = [];
      return;
    }
    const index = this.activity.cards.findIndex(card => card.id === updatedCard.id);
    if (index !== -1) {
      this.activity.cards[index] = updatedCard;
      await this.ctx.storage.put("activity", this.activity);
    }
  }

  async deleteCard(cardId: string) {
    if (!this.activity.cards) {
      return;
    }
    this.activity.cards = this.activity.cards.filter(card => card.id !== cardId);
    await this.ctx.storage.put("activity", this.activity);
  }

  async updateName(name: string) {
    this.activity.name = name;
    await this.ctx.storage.put("activity", this.activity);
  }

  async updateDates(startDate: string, endDate?: string, startTime?: string) {
    this.activity.startDate = startDate;
    this.activity.endDate = endDate;
    this.activity.startTime = startTime;
    await this.ctx.storage.put("activity", this.activity);
  }

  // Lifecycle methods

  async onStart() {
    this.activity = await this.ctx.storage.get<Activity>("activity") || { cards: [] };
  }

  async onConnect(connection: Connection) {
    connection.send(
      JSON.stringify({
        type: "activity",
        activity: this.activity,
      } satisfies Message),
    );
  }

  async onMessage(_connection: Connection, rawMessage: WSMessage) {
    const message = JSON.parse(rawMessage as string) as Message;
    await this.handleMessage(message);
  }

  async onRequest(request: Request) {
    if (request.method === "POST") {
      try {
        const message = await request.json() as Message;
        if (!message || typeof message.type !== "string") {
          return new Response("Bad Request", { status: 400 });
        }
        await this.handleMessage(message);
        return new Response("OK");
      } catch {
        return new Response("Bad Request", { status: 400 });
      }
    }
    if (request.method === "GET") {
      return new Response(JSON.stringify(this.activity), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Method not allowed", { status: 405 });
  }

  // Private methods

  private async handleMessage(message: Message) {
    if (message.type === "name") {
      await this.updateName(message.name);
      this.broadcastMessage({
        type: "name",
        name: message.name,
      });

      return;
    }

    if (message.type === "dates") {
      await this.updateDates(message.startDate, message.endDate, message.startTime);
      this.broadcastMessage({
        type: "dates",
        startDate: message.startDate,
        endDate: message.endDate,
        startTime: message.startTime,
      });

      return;
    }

    if (message.type === "card-create") {
      await this.addCard(message.card);
      this.broadcastMessage({
        type: "card-create",
        card: message.card,
      });

      return;
    }

    if (message.type === "card-update") {
      await this.updateCard(message.card);
      this.broadcastMessage({
        type: "card-update",
        card: message.card,
      });

      return;
    }

    if (message.type === "card-delete") {
      await this.deleteCard(message.cardId);
      this.broadcastMessage({
        type: "card-delete",
        cardId: message.cardId,
      });

      return;
    }
  }

  private broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }
}
