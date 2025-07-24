import { getPrisma as getPrismaClient } from "./db";
import type { User as AuthUser, Profile } from '@auth/core/types';
import type { Env } from "./index";

export async function persistUser(env: Env, authUser: AuthUser, profile: Profile | undefined) {
  const prismaClient = getPrismaClient(env);

  await prismaClient.user.upsert({
    where: { email: authUser.email! },
    update: {
      name: authUser.name || '',
      picture: authUser.image || profile?.picture || null,
    },
    create: {
      email: authUser.email!,
      name: authUser.name || '',
      picture: authUser.image || profile?.picture || null,
    },
  });
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
