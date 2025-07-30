import {
  type Connection,
  Server,
  type WSMessage,
} from "partyserver";

import type { Activity, Message, Card, AILinkCard } from "../shared";
import { createEmptyActivity } from "../shared";
import type { Env } from "./index";

export class ActivityDO extends Server<Env> {
  static options = { hibernate: true };

  activity = {} as Activity;

  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  async addCard(card: Card) {
    if (!this.activity.cards) {
      this.activity.cards = [];
    }

    // Trigger workflow for AILink cards
    if (card.type === 'ailink') {
      const id = crypto.randomUUID();
      await this.env.AILINK_WORKFLOW.create({
        id,
        params: {
          cardId: card.id,
          url: (card as AILinkCard).url,
          durableObjectId: this.ctx.id.toString()
        }
      });
      // add the workflow id to the card
      (card as AILinkCard).workflowId = id;
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

  async onStart() {
    this.activity = await this.ctx.storage.get<Activity>("activity") || createEmptyActivity();
  }

  onConnect(connection: Connection) {
    connection.send(
      JSON.stringify({
        type: "activity",
        activity: this.activity,
      } satisfies Message),
    );
  }

  async handleMessage(parsed: Message) {
    if (parsed.type === "name") {
      await this.updateName(parsed.name);
      this.broadcastMessage({
        type: "name",
        name: parsed.name,
      });
    } else if (parsed.type === "dates") {
      await this.updateDates(parsed.startDate, parsed.endDate, parsed.startTime);
      this.broadcastMessage({
        type: "dates",
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        startTime: parsed.startTime,
      });
    } else if (parsed.type === "card-create") {
      await this.addCard(parsed.card);
      this.broadcastMessage({
        type: "card-create",
        card: parsed.card,
      });
    } else if (parsed.type === "card-update") {
      await this.updateCard(parsed.card);
      this.broadcastMessage({
        type: "card-update",
        card: parsed.card,
      });
    } else if (parsed.type === "card-delete") {
      await this.deleteCard(parsed.cardId);
      this.broadcastMessage({
        type: "card-delete",
        cardId: parsed.cardId,
      });
    }
  }

  async onMessage(_connection: Connection, message: WSMessage) {
    const parsed = JSON.parse(message as string) as Message;
    await this.handleMessage(parsed);
  }

  async onRequest(request: Request) {
    if (request.method === "POST") {
      try {
        const parsed = await request.json() as Message;
        if (!parsed || typeof parsed.type !== "string") {
          return new Response("Bad Request", { status: 400 });
        }
        await this.handleMessage(parsed);
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
}
