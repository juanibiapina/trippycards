import { describe, it, expect } from 'vitest';
import * as Y from 'yjs';
import type { Activity, Card, PollCard } from '../shared';

describe('Yjs Integration', () => {
  it('should create and manipulate activity data structure', () => {
    const doc = new Y.Doc();

    // Initialize the document structure
    const activityMap = doc.getMap('activity');
    const cardsArray = doc.getArray('cards');

    // Set activity metadata
    activityMap.set('name', 'Test Activity');
    activityMap.set('startDate', '2024-01-01');

    // Create a test card
    const testCard: Card = {
      id: 'card-1',
      type: 'note',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    };

    // Add card to Yjs array
    const cardMap = new Y.Map();
    Object.entries(testCard).forEach(([key, value]) => {
      cardMap.set(key, value);
    });
    cardsArray.push([cardMap]);

    // Verify the data structure
    expect(activityMap.get('name')).toBe('Test Activity');
    expect(activityMap.get('startDate')).toBe('2024-01-01');
    expect(cardsArray.length).toBe(1);

    const savedCard = cardsArray.get(0);
    expect(savedCard.get('id')).toBe('card-1');
    expect(savedCard.get('type')).toBe('note');
  });

  it('should handle card updates correctly', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Add initial card
    const cardMap = new Y.Map();
    cardMap.set('id', 'card-1');
    cardMap.set('type', 'note');
    cardMap.set('text', 'Original text');
    cardsArray.push([cardMap]);

    // Update the card
    const savedCard = cardsArray.get(0);
    savedCard.set('text', 'Updated text');
    savedCard.set('updatedAt', '2024-01-01T11:00:00Z');

    // Verify update
    expect(savedCard.get('text')).toBe('Updated text');
    expect(savedCard.get('updatedAt')).toBe('2024-01-01T11:00:00Z');
  });

  it('should handle card deletion correctly', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Add two cards
    const card1 = new Y.Map();
    card1.set('id', 'card-1');
    card1.set('type', 'note');

    const card2 = new Y.Map();
    card2.set('id', 'card-2');
    card2.set('type', 'link');

    cardsArray.push([card1, card2]);
    expect(cardsArray.length).toBe(2);

    // Delete the first card
    cardsArray.delete(0);
    expect(cardsArray.length).toBe(1);
    expect(cardsArray.get(0).get('id')).toBe('card-2');
  });

  it('should preserve card insertion order', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Add cards in a specific order
    for (let i = 1; i <= 3; i++) {
      const cardMap = new Y.Map();
      cardMap.set('id', `card-${i}`);
      cardMap.set('order', i);
      cardsArray.push([cardMap]);
    }

    // Verify order is maintained
    expect(cardsArray.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(cardsArray.get(i).get('id')).toBe(`card-${i + 1}`);
      expect(cardsArray.get(i).get('order')).toBe(i + 1);
    }
  });

  it('should extract Activity state correctly', () => {
    const doc = new Y.Doc();

    // Setup document structure
    const activityMap = doc.getMap('activity');
    const cardsArray = doc.getArray('cards');

    activityMap.set('name', 'Test Activity');
    activityMap.set('startDate', '2024-01-01');
    activityMap.set('endDate', '2024-01-02');

    const cardMap = new Y.Map();
    cardMap.set('id', 'card-1');
    cardMap.set('type', 'note');
    cardMap.set('createdAt', '2024-01-01T10:00:00Z');
    cardMap.set('updatedAt', '2024-01-01T10:00:00Z');
    cardsArray.push([cardMap]);

    // Extract activity state (similar to what ActivityDO.getActivityState does)
    const cards: Card[] = [];
    for (let i = 0; i < cardsArray.length; i++) {
      const card = cardsArray.get(i);
      const cardObj: Record<string, unknown> = {};
      card.forEach((value, key) => {
        cardObj[key] = value;
      });
      cards.push(cardObj as unknown as Card);
    }

    const activity: Activity = { cards };

    if (activityMap.has('name')) {
      activity.name = activityMap.get('name') as string;
    }
    if (activityMap.has('startDate')) {
      activity.startDate = activityMap.get('startDate') as string;
    }
    if (activityMap.has('endDate')) {
      activity.endDate = activityMap.get('endDate') as string;
    }

    // Verify extracted state
    expect(activity.name).toBe('Test Activity');
    expect(activity.startDate).toBe('2024-01-01');
    expect(activity.endDate).toBe('2024-01-02');
    expect(activity.cards).toHaveLength(1);
    expect(activity.cards?.[0].id).toBe('card-1');
    expect(activity.cards?.[0].type).toBe('note');
  });

  it('should handle nested card children with Y.Array', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Create parent card with children
    const parentCard = new Y.Map();
    parentCard.set('id', 'parent-card');
    parentCard.set('type', 'note');
    parentCard.set('text', 'Parent card');

    // Create children as Y.Array
    const childrenArray = new Y.Array();
    const child1 = new Y.Map();
    child1.set('id', 'child-1');
    child1.set('type', 'note');
    child1.set('text', 'Child note');

    const child2 = new Y.Map();
    child2.set('id', 'child-2');
    child2.set('type', 'poll');
    child2.set('question', 'Child poll?');
    child2.set('options', ['Yes', 'No']);

    childrenArray.push([child1, child2]);
    parentCard.set('children', childrenArray);
    cardsArray.push([parentCard]);

    // Verify structure
    expect(cardsArray.length).toBe(1);
    const savedParent = cardsArray.get(0);
    expect(savedParent.get('id')).toBe('parent-card');

    const savedChildren = savedParent.get('children') as Y.Array<Y.Map<unknown>>;
    expect(savedChildren).toBeInstanceOf(Y.Array);
    expect(savedChildren.length).toBe(2);

    const savedChild1 = savedChildren.get(0);
    expect(savedChild1.get('id')).toBe('child-1');
    expect(savedChild1.get('text')).toBe('Child note');

    const savedChild2 = savedChildren.get(1);
    expect(savedChild2.get('id')).toBe('child-2');
    expect(savedChild2.get('question')).toBe('Child poll?');
  });

  it('should handle real-time updates to nested children', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Create parent card with poll child
    const parentCard = new Y.Map();
    parentCard.set('id', 'parent-card');
    parentCard.set('type', 'note');

    const childrenArray = new Y.Array();
    const pollChild = new Y.Map();
    pollChild.set('id', 'poll-child');
    pollChild.set('type', 'poll');
    pollChild.set('question', 'Vote?');
    pollChild.set('options', ['Option A', 'Option B']);
    pollChild.set('votes', []);

    childrenArray.push([pollChild]);
    parentCard.set('children', childrenArray);
    cardsArray.push([parentCard]);

    // Track changes with observer on the child map itself
    let observedChanges = 0;
    const observer = () => {
      observedChanges++;
    };
    pollChild.observe(observer);

    // Update the poll child's votes
    pollChild.set('votes', [{ userId: 'user1', option: 0 }]);

    // Verify the observer was triggered on the child map
    expect(observedChanges).toBeGreaterThan(0);
    expect(pollChild.get('votes')).toEqual([{ userId: 'user1', option: 0 }]);
  });

  it('should extract nested children correctly from Yjs structure', () => {
    const doc = new Y.Doc();
    const cardsArray = doc.getArray('cards');

    // Create parent card with nested children structure
    const parentCard = new Y.Map();
    parentCard.set('id', 'parent-card');
    parentCard.set('type', 'note');
    parentCard.set('text', 'Parent');

    const childrenArray = new Y.Array();
    const child1 = new Y.Map();
    child1.set('id', 'child-1');
    child1.set('type', 'note');
    child1.set('text', 'Child 1');
    child1.set('date', '2024-01-01');

    const child2 = new Y.Map();
    child2.set('id', 'child-2');
    child2.set('type', 'poll');
    child2.set('question', 'Choose option?');
    child2.set('options', ['A', 'B', 'C']);
    child2.set('votes', [{ userId: 'user1', option: 1 }]);

    childrenArray.push([child1, child2]);
    parentCard.set('children', childrenArray);
    cardsArray.push([parentCard]);

    // Extract using the same logic as the fixed extractActivityFromDoc
    const extractedCards: Card[] = [];
    for (let i = 0; i < cardsArray.length; i++) {
      const cardMap = cardsArray.get(i);
      const card: Record<string, unknown> = {};
      cardMap.forEach((value, key) => {
        if (key === 'children' && value instanceof Y.Array) {
          const childrenArray: Card[] = [];
          const childrenYArray = value as Y.Array<Y.Map<unknown>>;
          for (let j = 0; j < childrenYArray.length; j++) {
            const childMap = childrenYArray.get(j);
            const childCard: Record<string, unknown> = {};
            childMap.forEach((childValue, childKey) => {
              childCard[childKey] = childValue;
            });
            childrenArray.push(childCard as unknown as Card);
          }
          card[key] = childrenArray;
        } else {
          card[key] = value;
        }
      });
      extractedCards.push(card as unknown as Card);
    }

    // Verify extraction
    expect(extractedCards).toHaveLength(1);
    const extractedParent = extractedCards[0];
    expect(extractedParent.id).toBe('parent-card');
    expect(extractedParent.children).toHaveLength(2);

    const extractedChild1 = extractedParent.children![0];
    expect(extractedChild1.id).toBe('child-1');
    expect(extractedChild1.date).toBe('2024-01-01');

    const extractedChild2 = extractedParent.children![1] as PollCard;
    expect(extractedChild2.id).toBe('child-2');
    expect(extractedChild2.question).toBe('Choose option?');
    expect(extractedChild2.votes).toEqual([{ userId: 'user1', option: 1 }]);
  });
});