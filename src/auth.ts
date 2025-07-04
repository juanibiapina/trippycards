import { betterAuth } from "better-auth";

export function createAuth(env: {
  DATABASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BASE_URL?: string;
}) {
  return betterAuth({
    database: {
      provider: "pg",
      url: env.DATABASE_URL,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    baseURL: env.BASE_URL || "http://localhost:5173",
  });
}

// Simple mock session for development
export const mockSession = {
  user: {
    id: "mock-user-id",
    name: "Demo User",
    email: "demo@example.com",
    image: "https://via.placeholder.com/48",
  },
};

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};