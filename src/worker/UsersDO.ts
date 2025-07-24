import { DurableObject } from "cloudflare:workers";

import type { Env } from "./index";

export class UsersDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
}
