import type { User as AuthUser, Profile } from '@auth/core/types';
import type { Env } from "./index";

function getUsersDO(env: Env) {
  const id = env.USERSDO.idFromName("singleton");
  return env.USERSDO.get(id);
}

export async function persistUser(env: Env, authUser: AuthUser, profile: Profile | undefined) {
  const usersDO = getUsersDO(env);
  // Type assertion needed for DurableObject stub method calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (usersDO as any).upsertUser(
    authUser.email!,
    authUser.name || '',
    authUser.image || profile?.picture || null
  );

  return result;
}

export async function getUserById(env: Env, id: number) {
  const usersDO = getUsersDO(env);
  // Type assertion needed for DurableObject stub method calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await (usersDO as any).getUserById(id);
}

export async function getUserByEmail(env: Env, email: string) {
  const usersDO = getUsersDO(env);
  // Type assertion needed for DurableObject stub method calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await (usersDO as any).getUserByEmail(email);
}
