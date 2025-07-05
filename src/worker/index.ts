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
  TEST_MODE?: string;
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
// Mock session endpoint for test mode - must come before authHandler
app.get('/api/auth/session', async (c) => {
  if (c.env.TEST_MODE === 'true') {
    // Return a mock session in test mode
    return c.json({
      user: {
        id: 'test-user-1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  // In production, this will be handled by authHandler below
  return c.notFound();
});

app.use('/api/auth/*', authHandler())

// Test authentication endpoint - only available in test mode
app.post('/api/auth/test-login', async (c) => {
  // Only allow in test mode
  if (c.env.TEST_MODE !== 'true') {
    return c.json({ error: 'Not available in production' }, 404);
  }

  const { user } = await c.req.json();

  // Create a test session that mimics the real auth session
  const testSession = {
    user: {
      id: user?.id || 'test-user-1',
      name: user?.name || 'Test User',
      email: user?.email || 'test@example.com',
      image: user?.image || null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  // Set the session cookie similar to how auth.js does it
  const cookieValue = JSON.stringify(testSession);
  const encodedCookie = btoa(cookieValue);

  c.header('Set-Cookie', `next-auth.session-token=${encodedCookie}; Path=/; HttpOnly; SameSite=Lax`);

  return c.json({ session: testSession });
});

// Verify authentication for all API routes (except test routes)
app.use('/api/*', async (c, next) => {
  // Skip auth verification in test mode for test-login endpoint
  if (c.env.TEST_MODE === 'true' && c.req.path === '/api/auth/test-login') {
    return next();
  }

  // In test mode, set a mock auth user context for all other API routes
  if (c.env.TEST_MODE === 'true') {
    c.set('authUser', {
      session: {
        user: {
          id: 'test-user-1',
          name: 'Test User',
          email: 'test@example.com',
          image: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    return next();
  }

  // Use normal auth verification in production
  return verifyAuth()(c, next);
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

  const id: DurableObjectId = c.env.TRIPDO.idFromName(tripId.toString());
  const stub = c.env.TRIPDO.get(id);

  const trip = await stub.get();

  return c.json(trip);
});

export default app;
