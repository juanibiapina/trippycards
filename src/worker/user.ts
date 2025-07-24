import { getPrisma as getPrismaClient } from "./db";
import type { User as AuthUser, Profile } from '@auth/core/types';
import type { Env } from "./index";

function getUsersDO(env: Env) {
  const id = env.USERSDO.idFromName("singleton");
  return env.USERSDO.get(id);
}

export async function persistUser(env: Env, authUser: AuthUser, profile: Profile | undefined) {
  const prismaClient = getPrismaClient(env);

  // Write to Prisma (primary source)
  const prismaResult = await prismaClient.user.upsert({
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

  // Write to UsersDO (dual write)
  const usersDO = getUsersDO(env);
  await usersDO.upsertUser(
    authUser.email!,
    authUser.name || '',
    authUser.image || profile?.picture || null
  );

  return prismaResult;
}

export async function getUserById(env: Env, id: number) {
  const usersDO = getUsersDO(env);
  return await usersDO.getUserById(id);
}

export async function getUserByEmail(env: Env, email: string) {
  const usersDO = getUsersDO(env);
  return await usersDO.getUserByEmail(email);
}
