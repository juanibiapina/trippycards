import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from "../lib/auth";

import { TripDO } from "./trip";
export { TripDO } from "./trip";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Auth routes
app.all("/api/auth/*", async (c) => {
  // Set environment variables for better-auth
  process.env.GOOGLE_CLIENT_ID = c.env.GOOGLE_CLIENT_ID;
  process.env.GOOGLE_CLIENT_SECRET = c.env.GOOGLE_CLIENT_SECRET;
  process.env.BETTER_AUTH_URL = c.env.BETTER_AUTH_URL;
  process.env.BETTER_AUTH_SECRET = c.env.BETTER_AUTH_SECRET;
  process.env.DATABASE_URL = c.env.DATABASE_URL;

  return auth.handler(c.req.raw);
});

app.get("/api/", async (c) => {
  // Get session from better-auth
  const session = await auth.api.getSession({
    headers: new Headers(Object.entries(c.req.header())),
  });

  if (session) {
    return c.json({ name: session.user.name, authenticated: true });
  }

  return c.json({ name: "Guest", authenticated: false });
});

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

  const id:DurableObjectId = c.env.TRIPDO.idFromName(tripId.toString());
  const stub = c.env.TRIPDO.get(id);

  const trip = await stub.get();

  return c.json(trip);
});

export default app;
