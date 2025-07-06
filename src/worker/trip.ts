import { DurableObject } from "cloudflare:workers";

export type Trip = {
  name?: string;
  fresh?: boolean;
  owner?: string;
}

export class TripDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    // Required, as we're extending the base class.
    super(ctx, env)
  }

  async get(): Promise<Trip> {
    const name = await this.ctx.storage.get<string>('name');
    const owner = await this.ctx.storage.get<string>('owner');
    const hasBeenAccessed = await this.ctx.storage.get<boolean>('hasBeenAccessed');

    // If this is the first access, mark it as fresh
    const fresh = !hasBeenAccessed;

    // Mark as accessed for future calls
    if (!hasBeenAccessed) {
      await this.ctx.storage.put('hasBeenAccessed', true);
    }

    return { name, fresh, owner };
  }

  async updateName(name: string, ownerEmail?: string): Promise<void> {
    await this.ctx.storage.put('name', name);

    // Set owner if provided and not already set
    const existingOwner = await this.ctx.storage.get<string>('owner');
    if (!existingOwner && ownerEmail) {
      await this.ctx.storage.put('owner', ownerEmail);
    }
  }
}
