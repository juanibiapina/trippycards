import { Hono } from "hono";
import { logger } from "hono/logger";
import { verifyToken } from "@clerk/backend";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { partyserverMiddleware } from "hono-party";
import * as Sentry from "@sentry/cloudflare";
import { HTTPException } from "hono/http-exception";
import { ActivityDO } from "./ActivityDO";

export interface Env {
  SENTRY_DSN?: string;
  ENVIRONMENT?: string;
  FIRECRAWL_API_KEY: string;
  CF_VERSION_METADATA?: {
    id: string;
  };
  KV: KVNamespace;
  ACTIVITYDO: DurableObjectNamespace<ActivityDO>;
  AILINK_WORKFLOW: Workflow;
  JWKS_PK: string; // Public key for JWT verification
}

const createApp = (env: Env) => {
  const app = new Hono<{ Bindings: Env }>()
    .onError((err, c) => {
      console.error("Error occurred:", err);
      console.error("Error stack:", err.stack);
      Sentry.captureException(err);

      if (err instanceof HTTPException) {
        return err.getResponse();
      }

      return c.json({ error: "Internal server error" }, 500);
    });

  app.use(logger());

  app.use("*", partyserverMiddleware({
    onError: (error) => console.error(error),
    options: {
      onBeforeConnect: async (req) => {
        // get token from query string
        const token = new URL(req.url).searchParams.get("token") ?? "";

        // Allow connection without token for development/testing
        if (!token) {
          console.warn("WebSocket connection without authentication token");
          return; // Allow connection
        }

        try {
          await verifyToken(token, {
            jwtKey: env.JWKS_PK,
          });
        } catch (error) {
          console.error("Token verification failed:", error);
          return new Response("Unauthorized", { status: 401 });
        }
      }
    },
  }));
  app.use("*", clerkMiddleware());

  // Verify authentication for API routes
  app.use('/api/*', async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log(`Authenticated user: ${auth.userId}`);

    await next();
  });

  app.get('/api/users/:id', async (c) => {
    const clerk = c.get('clerk');

    const id = String(c.req.param('id'));

    const user = await clerk.users.getUser(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      id: user.id.toString(),
      name: user.fullName,
      profileImage: user.imageUrl,
    });
  });

  return app;
};

export default Sentry.withSentry(
  (env: Env) => {
    const environment = env.ENVIRONMENT || 'development';
    const { id: versionId } = env.CF_VERSION_METADATA || { id: 'unknown' };

    return {
      // Disable Sentry in development by not setting DSN
      dsn: environment === 'development' ? undefined : env.SENTRY_DSN,
      environment,
      release: versionId,
      sendDefaultPii: true,
      tracesSampleRate: 1.0,
    };
  },
  {
    fetch(req, env: Env, ctx) {
      return createApp(env).fetch(req, env, ctx);
    },
  }
);
export { ActivityDO } from "./ActivityDO";
export { default as AiLinkProcessor } from "./workflows/AiLinkProcessor";
