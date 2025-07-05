import { Hono } from "hono";
import { logger } from "hono/logger";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import { TripDO } from "./trip";
export { TripDO } from "./trip";

export interface Env {
  DATABASE_URL: string;
  TRIPDO: DurableObjectNamespace<TripDO>;
}

const app = new Hono<{ Bindings: Env }>();

app.use(logger());

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
