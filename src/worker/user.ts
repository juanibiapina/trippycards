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
  const prismaClient = getPrismaClient(env);

  // For now, still read from Prisma (primary source)
  const prismaResult = await prismaClient.user.findUnique({
    where: { id },
  });

  // TODO: In future phases, we can switch to reading from UsersDO
  // and fallback to Prisma if not found

  return prismaResult;
}

export async function getUserByEmail(env: Env, email: string) {
  const prismaClient = getPrismaClient(env);

  // For now, still read from Prisma (primary source)
  const prismaResult = await prismaClient.user.findUnique({
    where: { email: email }
  });

  // TODO: In future phases, we can switch to reading from UsersDO
  // and fallback to Prisma if not found

  return prismaResult;
}
