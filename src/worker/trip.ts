import { DurableObject } from "cloudflare:workers";

export interface Card {
  id: string;
  title: string;
}

export type Trip = {
  name?: string;
  cards?: Card[];
}

export class TripDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    // Required, as we're extending the base class.
    super(ctx, env)
  }

  async get(): Promise<Trip> {
    const name = await this.ctx.storage.get<string>('name');
    const cards = await this.ctx.storage.get<Card[]>('cards') || [];
    return { name, cards };
  }

  async updateName(name: string): Promise<void> {
    await this.ctx.storage.put('name', name);
  }

  async addCard(card: Card): Promise<void> {
    const cards = await this.ctx.storage.get<Card[]>('cards') || [];
    cards.push(card);
    await this.ctx.storage.put('cards', cards);
  }

  async updateCard(cardId: string, title: string): Promise<boolean> {
    const cards = await this.ctx.storage.get<Card[]>('cards') || [];
    const cardIndex = cards.findIndex(card => card.id === cardId);

    if (cardIndex === -1) {
      return false;
    }

    cards[cardIndex].title = title;
    await this.ctx.storage.put('cards', cards);
    return true;
  }

  async deleteCard(cardId: string): Promise<boolean> {
    const cards = await this.ctx.storage.get<Card[]>('cards') || [];
    const cardIndex = cards.findIndex(card => card.id === cardId);

    if (cardIndex === -1) {
      return false;
    }

    cards.splice(cardIndex, 1);
    await this.ctx.storage.put('cards', cards);
    return true;
  }

  async getCard(cardId: string): Promise<Card | null> {
    const cards = await this.ctx.storage.get<Card[]>('cards') || [];
    return cards.find(card => card.id === cardId) || null;
  }
}
