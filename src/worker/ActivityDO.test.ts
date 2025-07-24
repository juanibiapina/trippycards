import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEmptyActivity, LinkCard } from '../shared';

// Mock partyserver imports to avoid CloudFlare worker issues in tests
vi.mock('partyserver', () => ({
  Server: class MockServer {
    constructor() {}
    broadcast() {}
    broadcastMessage() {}
  },
}));

// Import ActivityDO after mocking
const { ActivityDO } = await import('./ActivityDO');

// Mock the partyserver types
interface MockConnection {
  send: ReturnType<typeof vi.fn>;
}

interface MockContext {
  storage: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
}

const mockConnection: MockConnection = {
  send: vi.fn(),
};

const mockContext: MockContext = {
  storage: {
    get: vi.fn(),
    put: vi.fn(),
  },
};

// Create a test environment for ActivityDO
class TestActivityDO extends ActivityDO {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(mockContext as any, {} as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ctx = mockContext as any;
  }

  // Expose broadcast method for testing
  public testBroadcast = vi.fn();

  broadcast(message: string, exclude?: string[]) {
    this.testBroadcast(message, exclude);
  }
}

describe('ActivityDO Card CRUD Operations', () => {
  let activityDO: TestActivityDO;
  let mockCard: LinkCard;

  beforeEach(() => {
    vi.clearAllMocks();
    activityDO = new TestActivityDO();

    // Initialize with empty activity
    activityDO.activity = createEmptyActivity();

    mockCard = {
      id: 'card-1',
      type: 'link',
      url: 'https://example.com',
      title: 'Test Card',
      description: 'Test Description',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
  });

  describe('addCard', () => {
    it('should add a card to empty cards array', async () => {
      await activityDO.addCard(mockCard);

      expect(activityDO.activity.cards).toHaveLength(1);
      expect(activityDO.activity.cards![0]).toEqual(mockCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should add a card to existing cards array', async () => {
      const existingCard: LinkCard = {
        id: 'card-2',
        type: 'link',
        url: 'https://existing.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      activityDO.activity.cards = [existingCard];
      await activityDO.addCard(mockCard);

      expect(activityDO.activity.cards).toHaveLength(2);
      expect(activityDO.activity.cards![1]).toEqual(mockCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should initialize cards array if undefined', async () => {
      activityDO.activity.cards = undefined;
      await activityDO.addCard(mockCard);

      expect(activityDO.activity.cards).toHaveLength(1);
      expect(activityDO.activity.cards![0]).toEqual(mockCard);
    });
  });

  describe('updateCard', () => {
    it('should update an existing card', async () => {
      activityDO.activity.cards = [mockCard];

      const updatedCard: LinkCard = {
        ...mockCard,
        title: 'Updated Title',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      await activityDO.updateCard(updatedCard);

      expect(activityDO.activity.cards![0]).toEqual(updatedCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should not update if card does not exist', async () => {
      activityDO.activity.cards = [mockCard];

      const nonExistentCard: LinkCard = {
        ...mockCard,
        id: 'non-existent',
      };

      await activityDO.updateCard(nonExistentCard);

      expect(activityDO.activity.cards![0]).toEqual(mockCard);
      expect(mockContext.storage.put).not.toHaveBeenCalled();
    });

    it('should handle empty cards array', async () => {
      activityDO.activity.cards = [];
      await activityDO.updateCard(mockCard);

      expect(activityDO.activity.cards).toHaveLength(0);
      expect(mockContext.storage.put).not.toHaveBeenCalled();
    });

    it('should handle undefined cards array', async () => {
      activityDO.activity.cards = undefined;
      await activityDO.updateCard(mockCard);

      expect(activityDO.activity.cards).toEqual([]);
      expect(mockContext.storage.put).not.toHaveBeenCalled();
    });
  });

  describe('deleteCard', () => {
    it('should delete an existing card', async () => {
      const card2: LinkCard = {
        id: 'card-2',
        type: 'link',
        url: 'https://example2.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      activityDO.activity.cards = [mockCard, card2];
      await activityDO.deleteCard('card-1');

      expect(activityDO.activity.cards).toHaveLength(1);
      expect(activityDO.activity.cards![0]).toEqual(card2);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should handle deleting non-existent card', async () => {
      activityDO.activity.cards = [mockCard];
      await activityDO.deleteCard('non-existent');

      expect(activityDO.activity.cards).toHaveLength(1);
      expect(activityDO.activity.cards![0]).toEqual(mockCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should handle empty cards array', async () => {
      activityDO.activity.cards = [];
      await activityDO.deleteCard('card-1');

      expect(activityDO.activity.cards).toHaveLength(0);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
    });

    it('should handle undefined cards array', async () => {
      activityDO.activity.cards = undefined;
      await activityDO.deleteCard('card-1');

      expect(mockContext.storage.put).not.toHaveBeenCalled();
    });
  });

  describe('WebSocket message handling', () => {
    it('should handle card-create message', async () => {
      const message = JSON.stringify({
        type: 'card-create',
        card: mockCard,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await activityDO.onMessage(mockConnection as any, message);

      expect(activityDO.activity.cards).toHaveLength(1);
      expect(activityDO.activity.cards![0]).toEqual(mockCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
      expect(activityDO.testBroadcast).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'card-create',
          card: mockCard,
        }),
        undefined
      );
    });

    it('should handle card-update message', async () => {
      activityDO.activity.cards = [mockCard];

      const updatedCard: LinkCard = {
        ...mockCard,
        title: 'Updated Title',
      };

      const message = JSON.stringify({
        type: 'card-update',
        card: updatedCard,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await activityDO.onMessage(mockConnection as any, message);

      expect(activityDO.activity.cards![0]).toEqual(updatedCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
      expect(activityDO.testBroadcast).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'card-update',
          card: updatedCard,
        }),
        undefined
      );
    });

    it('should handle card-delete message', async () => {
      activityDO.activity.cards = [mockCard];

      const message = JSON.stringify({
        type: 'card-delete',
        cardId: 'card-1',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await activityDO.onMessage(mockConnection as any, message);

      expect(activityDO.activity.cards).toHaveLength(0);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);
      expect(activityDO.testBroadcast).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'card-delete',
          cardId: 'card-1',
        }),
        undefined
      );
    });
  });

  describe('persistence and atomic operations', () => {
    it('should persist activity state after each card operation', async () => {
      // Add card
      await activityDO.addCard(mockCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);

      // Update card
      const updatedCard = { ...mockCard, title: 'Updated' };
      await activityDO.updateCard(updatedCard);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);

      // Delete card
      await activityDO.deleteCard(mockCard.id);
      expect(mockContext.storage.put).toHaveBeenCalledWith('activity', activityDO.activity);

      expect(mockContext.storage.put).toHaveBeenCalledTimes(3);
    });

    it('should maintain consistency when multiple operations are performed', async () => {
      const card1: LinkCard = { ...mockCard, id: 'card-1' };
      const card2: LinkCard = { ...mockCard, id: 'card-2' };
      const card3: LinkCard = { ...mockCard, id: 'card-3' };

      // Add multiple cards
      await activityDO.addCard(card1);
      await activityDO.addCard(card2);
      await activityDO.addCard(card3);

      expect(activityDO.activity.cards).toHaveLength(3);

      // Update one card
      const updatedCard2 = { ...card2, title: 'Updated Card 2' };
      await activityDO.updateCard(updatedCard2);

      expect(activityDO.activity.cards!.find(c => c.id === 'card-2')).toEqual(updatedCard2);

      // Delete one card
      await activityDO.deleteCard('card-1');

      expect(activityDO.activity.cards).toHaveLength(2);
      expect(activityDO.activity.cards!.find(c => c.id === 'card-1')).toBeUndefined();
    });
  });
});