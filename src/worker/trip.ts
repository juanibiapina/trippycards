import { DurableObject } from "cloudflare:workers";

export type Trip = {
  name?: string;
}

export class TripDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    // Required, as we're extending the base class.
    super(ctx, env)
  }

  async get(): Promise<Trip> {
    return {};
  }
}
