import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User, Profile } from '@auth/core/types';

// Mock PrismaClient
const mockUpsert = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('../generated/prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $extends: vi.fn(() => ({
      user: {
        upsert: mockUpsert,
      },
      $disconnect: mockDisconnect,
    })),
  })),
}));

vi.mock('@prisma/extension-accelerate', () => ({
  withAccelerate: vi.fn(() => ({})),
}));

// Import the function after mocking
import { persistUser } from './user';

describe('User Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpsert.mockResolvedValue({});
    mockDisconnect.mockResolvedValue(undefined);
  });

  it('should create user with basic info when signing in', async () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://example.com/avatar.jpg',
    };

    const profile: Profile = {
      picture: 'https://example.com/profile.jpg',
    };

    await persistUser(user, profile, 'test-db-url');

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      update: {
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      },
    });
  });

  it('should use profile picture when user image is not available', async () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      // no image
    };

    const profile: Profile = {
      picture: 'https://example.com/profile.jpg',
    };

    await persistUser(user, profile, 'test-db-url');

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      update: {
        name: 'Test User',
        picture: 'https://example.com/profile.jpg',
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/profile.jpg',
      },
    });
  });

  it('should handle empty name gracefully', async () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      // no name
    };

    await persistUser(user, undefined, 'test-db-url');

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      update: {
        name: '',
        picture: null,
      },
      create: {
        email: 'test@example.com',
        name: '',
        picture: null,
      },
    });
  });

  it('should handle errors gracefully without throwing', async () => {
    mockUpsert.mockRejectedValueOnce(new Error('Database error'));

    const user: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    };

    // Should not throw
    await expect(persistUser(user, undefined, 'test-db-url')).resolves.toBeUndefined();
  });

  it('should always disconnect the database client', async () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    };

    await persistUser(user, undefined, 'test-db-url');

    expect(mockDisconnect).toHaveBeenCalledOnce();
  });

  it('should disconnect the database client even when an error occurs', async () => {
    mockUpsert.mockRejectedValueOnce(new Error('Database error'));

    const user: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    };

    await persistUser(user, undefined, 'test-db-url');

    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});