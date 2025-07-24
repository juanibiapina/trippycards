import { drizzle, type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from "cloudflare:workers";
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import migrations from '../../drizzle/migrations';
import { usersTable } from '../db/schema';

import type { Env } from "./index";

export type User = typeof usersTable.$inferSelect;

export class UsersDO extends DurableObject<Env> {
  db: DrizzleSqliteDODatabase;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.db = drizzle(ctx.storage, { logger: false });

    ctx.blockConcurrencyWhile(async () => {
      await this._migrate();
    });
  }

  async _migrate() {
    migrate(this.db, migrations);
  }

  async upsertUser(email: string, name: string, picture: string | null): Promise<User> {
    // Try to find existing user first
    const existingUser = this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (existingUser) {
      // Update existing user
      const [updatedUser] = await this.db
        .update(usersTable)
        .set({ name, picture })
        .where(eq(usersTable.email, email))
        .returning();
      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await this.db
        .insert(usersTable)
        .values({ email, name, picture })
        .returning();
      return newUser;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const user = this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .get();

    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    return user || null;
  }
}
