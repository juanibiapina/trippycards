import { Hono } from "hono";
import { logger } from "hono/logger";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import { handleMockSignIn } from './test-helpers'
import { partyserverMiddleware } from "hono-party";
import { persistUser } from "./user";
import { createGoogleCalendarEvent } from "../lib/googleCalendar";

export { ActivityDO } from "./activity";

export interface Env {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MOCK_AUTH?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(logger());

app.use( "*", partyserverMiddleware({ onError: (error) => console.error(error) }));

app.use(
  '*',
  initAuthConfig((c) => ({
    basePath: '/api/auth',
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
          },
        },
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
);

// Test-only mock authentication endpoint (must be before authHandler)
app.post('/api/auth/test-signin', handleMockSignIn);

app.use('/api/auth/*', authHandler())

// Verify authentication for all API routes
app.use('/api/*', verifyAuth())

// Google Calendar API route
app.post('/api/createGoogleCalendarEvent', async (c) => {
  try {
    const body = await c.req.json();
    const { activityName, date, activityUrl, accessToken } = body;

    // Validate required fields
    if (!activityName || !date || !activityUrl || !accessToken) {
      return c.json({
        error: 'Missing required fields: activityName, date, activityUrl, accessToken'
      }, 400);
    }

    // Create the calendar event
    const result = await createGoogleCalendarEvent(accessToken, {
      activityName,
      date,
      activityUrl
    });

    if (result.success) {
      return c.json({
        success: true,
        eventId: result.eventId,
        eventUrl: result.eventUrl
      });
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error('Error in createGoogleCalendarEvent API:', error);
    return c.json({
      error: 'Internal server error'
    }, 500);
  }
});

export default app;
