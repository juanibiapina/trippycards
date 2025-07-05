import { Hono } from "hono";
import { logger } from "hono/logger";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'

import { TripDO } from "./trip";
export { TripDO } from "./trip";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(logger());

app.use(
  '*',
  initAuthConfig((c) => ({
    basePath: '/api/auth',
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
        // The following block is useful for testing the entire flow in development
        //authorization: {
        //  params: {
        //    prompt: "consent",
        //  },
        //},
      }),
    ],
  }))
)
app.use('/api/auth/*', authHandler())

// Verify authentication for all API routes
app.use('/api/*', verifyAuth())

// routes

app.get("/api/trips/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid trip ID" }, 400);
  }

  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    return c.json({ error: "Trip not found" }, 404);
  }

  return c.json(trip);
});

app.get("/api/trips/v2/:tripId", async (c) => {
  const tripId = parseInt(c.req.param("tripId"));

  const id: DurableObjectId = c.env.TRIPDO.idFromName(tripId.toString());
  const stub = c.env.TRIPDO.get(id);

  const trip = await stub.get();

  return c.json(trip);
});

export default app;
