import { Hono } from "hono";
import { logger } from "hono/logger";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import type { User, Profile } from '@auth/core/types'

import { TripDO } from "./trip";
export { TripDO } from "./trip";
import { ActivityDO } from "./activity";
export { ActivityDO } from "./activity";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
  ACTIVITYDO: DurableObjectNamespace<ActivityDO>;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(logger());

// Function to persist user in database
async function persistUser(user: User, profile: Profile | undefined, databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());

  try {
    // Use upsert to either create new user or update existing one
    await prisma.user.upsert({
      where: { email: user.email! },
      update: {
        name: user.name || '',
        picture: user.image || profile?.picture || null,
      },
      create: {
        email: user.email!,
        name: user.name || '',
        picture: user.image || profile?.picture || null,
      },
    });
  } catch (error) {
    console.error('Failed to persist user:', error);
    // Don't throw error to avoid breaking the sign-in flow
  }
}

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
    callbacks: {
      async signIn({ user, profile }) {
        // Persist user when they sign in
        if (user.email) {
          await persistUser(user, profile, c.env.DATABASE_URL);
        }
        return true;
      },
    },
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

app.put("/api/trips/v2/:tripId", async (c) => {
  const tripId = parseInt(c.req.param("tripId"));
  const { name } = await c.req.json();

  if (!name || typeof name !== 'string') {
    return c.json({ error: "Invalid trip name" }, 400);
  }

  const id: DurableObjectId = c.env.TRIPDO.idFromName(tripId.toString());
  const stub = c.env.TRIPDO.get(id);

  await stub.updateName(name);

  return c.json({ success: true });
});

// Activity routes
app.post("/api/activities", async (c) => {
  const activityId = crypto.randomUUID();
  const id: DurableObjectId = c.env.ACTIVITYDO.idFromName(activityId);
  const stub = c.env.ACTIVITYDO.get(id);

  // Initialize empty activity
  await stub.get();

  return c.json({ activityId });
});

app.get("/api/activities/:activityId", async (c) => {
  const activityId = c.req.param("activityId");

  const id: DurableObjectId = c.env.ACTIVITYDO.idFromName(activityId);
  const stub = c.env.ACTIVITYDO.get(id);

  const activity = await stub.get();

  return c.json(activity);
});

app.post("/api/activities/:activityId/questions", async (c) => {
  const activityId = c.req.param("activityId");
  const { text } = await c.req.json();
  const auth = c.get('authUser');

  if (!text || typeof text !== 'string') {
    return c.json({ error: "Invalid question text" }, 400);
  }

  const id: DurableObjectId = c.env.ACTIVITYDO.idFromName(activityId);
  const stub = c.env.ACTIVITYDO.get(id);

  const question = await stub.createQuestion(text, auth.session?.user?.email || 'anonymous');

  return c.json(question);
});

app.post("/api/activities/:activityId/questions/:questionId/responses", async (c) => {
  const activityId = c.req.param("activityId");
  const questionId = c.req.param("questionId");
  const { response } = await c.req.json();
  const auth = c.get('authUser');

  if (!response || (response !== 'yes' && response !== 'no')) {
    return c.json({ error: "Invalid response" }, 400);
  }

  const id: DurableObjectId = c.env.ACTIVITYDO.idFromName(activityId);
  const stub = c.env.ACTIVITYDO.get(id);

  await stub.submitResponse(questionId, auth.session?.user?.email || 'anonymous', response);

  return c.json({ success: true });
});

export default app;
