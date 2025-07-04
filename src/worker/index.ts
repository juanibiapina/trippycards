import { Hono } from "hono";
import { mockSession } from "../auth";

import { TripDO } from "./trip";
export { TripDO } from "./trip";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BASE_URL?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Mock auth session endpoint for development
app.get("/api/auth/session", async (c) => {
  // For now, return a mock session to demonstrate the flow
  return c.json({ 
    data: mockSession,
    session: mockSession 
  });
});

// Mock Google OAuth redirect
app.get("/api/auth/signin/google", async (c) => {
  // In a real implementation, this would redirect to Google OAuth
  // For demo purposes, we'll just return a success message
  return c.json({ message: "OAuth flow would start here" });
});

// Mock signout endpoint
app.post("/api/auth/signout", async (c) => {
  return c.json({ message: "Signed out successfully" });
});

app.get("/api/", async (c) => {
  // For demo purposes, return the mock user data
  return c.json({ 
    name: mockSession.user.name, 
    email: mockSession.user.email 
  });
});

app.get("/api/trips/:id", async (c) => {
  // Mock trip data without Prisma for now to avoid build issues
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid trip ID" }, 400);
  }

  // Mock trip data
  const trip = { id, name: `Trip ${id}` };
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
