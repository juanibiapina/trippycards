import React from 'react';
import { Card } from '../../../shared';

export interface CardDefinition<TCard extends Card, TInput> {
  type: string;
  displayName: string;
  Component: React.FC<{
    card: TCard;
    userId?: string;
    onVote?: (optionIdx: number) => void;
  }>;
  FormComponent: React.FC<{
    onSubmit: (data: TInput) => void;
    onCancel: () => void;
    editingCard?: TCard;
  }>;
  icon?: React.ComponentType;
  description?: string;
}