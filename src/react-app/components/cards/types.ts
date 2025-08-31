import React from 'react';
import { Card } from '../../../shared';

export interface CardDefinition<TCard extends Card> {
  type: string;
  displayName: string;
  Component: React.FC<{
    card: TCard;
    userId?: string;
    onVote?: (optionIdx: number) => void;
  }>;
  FormComponent: React.FC<{
    onSubmit: (data: TCard) => void;
    onCancel: () => void;
  }>;
  icon?: React.ComponentType;
  description?: string;
}