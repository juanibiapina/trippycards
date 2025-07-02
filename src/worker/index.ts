import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export interface Env {
  DATABASE_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

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

export default app;
