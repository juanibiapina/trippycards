import React from 'react';
import { Card } from '../../../shared';

export interface BaseCardProps<TCard extends Card> {
  card: TCard;
  userId?: string;
  onUpdateCard: (card: TCard) => void;
}

export type CreateActionsFunction<TCard extends Card> = (
  card: TCard,
  onUpdateCard: (card: TCard) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Record<string, (...args: any[]) => void>;

export interface CardDefinition<TCard extends Card> {
  type: string;
  displayName: string;
  description?: string;
  Component: React.FC<BaseCardProps<TCard>>;
  FormComponent: React.FC<{
    onSubmit: (data: TCard) => void;
    onCancel: () => void;
  }>;
  createActions: CreateActionsFunction<TCard>;
}
