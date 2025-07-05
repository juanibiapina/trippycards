import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';
import GitHub from '@auth/core/providers/github';

import { TripDO } from "./trip";
export { TripDO } from "./trip";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
  AUTH_SECRET: string;
  GITHUB_ID: string;
  GITHUB_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Configure Auth.js
app.use(
  '*',
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_ID,
        clientSecret: c.env.GITHUB_SECRET,
      }),
    ],
  }))
);

// Auth routes
app.use('/api/auth/*', authHandler());

// Protected routes
app.use('/api/protected/*', verifyAuth());

app.get('/api/protected/user', (c) => {
  const auth = c.get('authUser');
  return c.json(auth);
});

app.get("/api/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.create({
    data: {
      email: `Jon${Math.ceil(Math.random() * 1000)}@gmail.com`,
      name: "Jon Doe",
    },
  });

  return c.json({name: user.name})
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
