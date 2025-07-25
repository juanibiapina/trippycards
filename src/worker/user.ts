import type { User as AuthUser, Profile } from '@auth/core/types';
import type { Env } from "./index";

function getUsersDO(env: Env) {
  const id = env.USERSDO.idFromName("singleton");
  return env.USERSDO.get(id);
}

export async function persistUser(env: Env, authUser: AuthUser, profile: Profile | undefined) {
  const usersDO = getUsersDO(env);
  return await usersDO.upsertUser(
    authUser.email!,
    authUser.name || '',
    authUser.image || profile?.picture || null
  );
}

export async function getUserById(env: Env, id: number) {
  const usersDO = getUsersDO(env);
  return await usersDO.getUserById(id);
}

export async function getUserByEmail(env: Env, email: string) {
  const usersDO = getUsersDO(env);
  return await usersDO.getUserByEmail(email);
}
