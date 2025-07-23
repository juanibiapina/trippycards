/**
 * Always use getPrisma(env) to initialize Prisma Client.
 * Never call new PrismaClient directly in other modules.
 */
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { Env } from "./index";

export function getPrisma(env: Env) {
  return new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
}