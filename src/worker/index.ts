import { Hono } from "hono";
import { logger } from "hono/logger";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import { handleMockSignIn } from './test-helpers'
import { partyserverMiddleware } from "hono-party";
import { persistUser, getUserById, getUserByEmail } from "./user";

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
      async session({ session }) {
        // Enrich session.user with the database user id
        if (session.user && session.user.email) {
          const user = await getUserByEmail(session.user.email, c.env.DATABASE_URL);
          if (user) {
            session.user.id = user.id.toString();
          }
        }
        return session;
      },
    },
  }))
);

// Test-only mock authentication endpoint (must be before authHandler)
app.post('/api/auth/test-signin', handleMockSignIn);

app.use('/api/auth/*', authHandler())

// Verify authentication for all API routes
app.use('/api/*', verifyAuth())

app.get('/api/users/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid user ID' }, 400);
  }
  const user = await getUserById(id, c.env.DATABASE_URL);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({
    id: user.id.toString(),
    name: user.name,
    profileImage: user.picture || null,
  });
});

export default app;
