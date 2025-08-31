# Creating New Card Types

This guide explains how to create new card types in the Trippy Cards application using the dynamic card registry system.

## Overview

The card system is built on a dynamic registry that automatically integrates new card types with zero changes required outside the `src/react-app/components/cards/` directory. Each card type consists of:

- Type definition extending the base `Card` interface
- Display component for rendering the card
- Form component for creating/editing the card
- Card definition with metadata and actions
- Registration in the central registry

## Step-by-Step Process

### 1. Create Card Directory Structure

Create a new directory for your card type:

```bash
mkdir src/react-app/components/cards/[card-name]
```

### 2. Define Card Type Interface

Create `types.ts` with your card's data structure:

```typescript
// src/react-app/components/cards/[card-name]/types.ts
import { Card } from '../../../../shared';

export interface [CardName]Card extends Card {
  type: '[card-name]';
  // Add your card-specific fields here
  fieldName: string;
  optionalField?: number;
}
```

**Requirements:**
- Must extend the base `Card` interface
- Must include a literal `type` field matching your card name
- Use descriptive field names that represent your card's data

### 3. Create Display Component

Create `[CardName]Card.tsx` for rendering the card:

```typescript
// src/react-app/components/cards/[card-name]/[CardName]Card.tsx
import React from 'react';
import type { [CardName]Card as [CardName]CardType } from './types';
import { BaseCardProps } from '../types';

export const [CardName]Card: React.FC<BaseCardProps<[CardName]CardType>> = ({ 
  card, 
  userId, 
  onUpdateCard 
}) => {
  return (
    <div className="space-y-3">
      {/* Your card content here */}
      <div className="text-gray-900">
        {card.fieldName}
      </div>
    </div>
  );
};

export default [CardName]Card;
```

**Key Points:**
- Use `BaseCardProps<YourCardType>` for type safety
- Keep the layout clean and consistent with other cards

### 4. Create Form Component

Create `[CardName]CardForm.tsx` for card creation:

```typescript
// src/react-app/components/cards/[card-name]/[CardName]CardForm.tsx
import React, { useState } from 'react';
import type { [CardName]Card } from './types';

interface [CardName]CardFormProps {
  onSubmit: (cardData: [CardName]Card) => void;
  onCancel: () => void;
}

export const [CardName]CardForm: React.FC<[CardName]CardFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [fieldName, setFieldName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation as needed
    if (!fieldName.trim()) {
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      type: '[card-name]',
      fieldName: fieldName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your form fields here */}
      <div>
        <label htmlFor="field-name" className="block text-sm font-medium text-gray-700 mb-2">
          Field Label
        </label>
        <input
          id="field-name"
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Enter value..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!fieldName.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create [Card Name]
        </button>
      </div>
    </form>
  );
};

export default [CardName]CardForm;
```

**Form Guidelines:**
- Always generate `id`, `createdAt`, and `updatedAt` fields
- Include proper validation before submission
- Use consistent button styling and layout
- Add `required` attributes for mandatory fields
- Use `disabled` state for submit button when invalid

### 5. Create Card Definition

Create `index.ts` to export the complete card definition:

```typescript
// src/react-app/components/cards/[card-name]/index.ts
import { CardDefinition, CreateActionsFunction } from '../types';
import [CardName]Card from './[CardName]Card';
import [CardName]CardForm from './[CardName]CardForm';
import type { [CardName]Card as [CardName]CardType } from './types';

const create[CardName]Actions: CreateActionsFunction<[CardName]CardType> = (card, onUpdateCard) => ({
  // Define card-specific actions here
  // For simple cards with no actions, return empty object: {}
  
  // Example action:
  // someAction: (param: string) => {
  //   const updatedCard = { ...card, fieldName: param };
  //   onUpdateCard(updatedCard);
  // }
});

export const [cardName]CardDefinition: CardDefinition<[CardName]CardType> = {
  type: '[card-name]',
  displayName: '[Card Display Name]',
  description: 'Brief description of what this card does',
  Component: [CardName]Card,
  FormComponent: [CardName]CardForm,
  createActions: create[CardName]Actions,
};

export { [CardName]Card, [CardName]CardForm };
export type { [CardName]CardType };
```

**Definition Requirements:**
- `type` must match the literal type in your interface
- `displayName` is shown in the UI (use title case)
- `description` appears in card creation UI
- Export both components and the type for external use

### 6. Register in Card Registry

Add your card to `src/react-app/components/cards/registry.ts`:

```typescript
// Add import
import { [cardName]CardDefinition } from './[card-name]';

// Add to cardDefinitions array
const cardDefinitions: CardDefinition<any>[] = [
  linkCardDefinition,
  pollCardDefinition,
  [cardName]CardDefinition  // Add your card here
];
```

## Actions System

### Simple Cards (No Actions)

For cards that only display data, return an empty object:

```typescript
const createMyActions: CreateActionsFunction<MyCardType> = () => ({
  // No actions needed
});
```

### Interactive Cards (With Actions)

For cards that need user interactions, define action functions:

```typescript
const createPollActions: CreateActionsFunction<PollCardType> = (card, onUpdateCard) => ({
  vote: (userId: string, optionIdx: number) => {
    const votes = card.votes ? [...card.votes] : [];
    const existing = votes.findIndex(v => v.userId === userId);

    if (existing !== -1) {
      votes[existing] = { userId, option: optionIdx };
    } else {
      votes.push({ userId, option: optionIdx });
    }

    const updatedCard = { ...card, votes };
    onUpdateCard(updatedCard);
  }
});
```

## Design Guidelines

- Use Tailwind classes from the [approved color palette](./colors.md)

## Benefits of This System

Cards can be created without any changes to the rest of the application as long as they can use one of the card systems available, defined in the `CardDefinition` interface.
