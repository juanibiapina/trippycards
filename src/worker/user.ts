import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { User, Profile } from '@auth/core/types'

export async function persistUser(user: User, profile: Profile | undefined, databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());

  console.log(JSON.stringify({
    action: 'persistUser',
    email: user.email,
    name: user.name,
    picture: user.image || profile?.picture,
  }));

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

export async function getUserById(id: number, databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());

  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string, databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());

  return prisma.user.findUnique({ where: { email: email } });
}
