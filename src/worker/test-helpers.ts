import type { User } from '@auth/core/types'
import { encode } from '@auth/core/jwt'
import type { Context } from 'hono'
import { persistUser } from './user'

export function createMockUser(): User {
  return {
    email: 'test@example.com',
    name: 'Test User',
    image: null
  };
}

export async function generateMockSessionToken(secret: string): Promise<string> {
  const mockUser = createMockUser();
  const now = Math.floor(Date.now() / 1000);

  return await encode({
    token: {
      email: mockUser.email,
      name: mockUser.name,
      picture: mockUser.image,
      sub: 'test-user-id',
      iat: now,
      exp: now + 24 * 60 * 60 // 24 hours from now
    },
    secret,
    salt: 'authjs.session-token',
  });
}

export function createMockAuthCookie(token: string): string {
  return `authjs.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export async function handleMockSignIn(c: Context): Promise<Response> {
  if (c.env.MOCK_AUTH !== 'true') {
    return c.json({ error: 'Mock auth not enabled' }, 404);
  }

  const mockUser = createMockUser();

  // Persist the user to the database (same as real auth flow)
  await persistUser(c.env, mockUser, undefined);

  const sessionToken = await generateMockSessionToken(c.env.AUTH_SECRET);

  c.header('Set-Cookie', createMockAuthCookie(sessionToken));

  return c.json({ success: true, user: mockUser });
}