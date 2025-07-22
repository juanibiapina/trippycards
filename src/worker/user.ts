import { getPrisma as getPrismaClient } from "./db";
import type { User, Profile } from '@auth/core/types';
import type { Env } from "./index";

export async function persistUser(env: Env, user: User, profile: Profile | undefined) {
  const prismaClient = getPrismaClient(env);

  console.log(JSON.stringify({
    action: 'persistUser',
    email: user.email,
    name: user.name,
    picture: user.image || profile?.picture,
  }));

  try {
    // Use upsert to either create new user or update existing one
    await prismaClient.user.upsert({
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

export async function getUserById(env: Env, id: number) {
  const prismaClient = getPrismaClient(env);

  return prismaClient.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(env: Env, email: string) {
  const prismaClient = getPrismaClient(env);

  return prismaClient.user.findUnique({ where: { email: email } });
}
