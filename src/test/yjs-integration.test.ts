import { describe, it, expect } from 'vitest';
import * as Y from 'yjs';
import type { Activity, Card } from '../shared';

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
});