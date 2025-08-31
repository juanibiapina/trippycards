import React from 'react';
import { Card } from '../../../shared';

export type CardAction = {
  type: string;
  payload?: unknown;
};

export type CardActionHandler<TCard extends Card> = (
  card: TCard,
  action: CardAction
) => TCard;

export interface CardDefinition<TCard extends Card> {
  type: string;
  displayName: string;
  description?: string;
  Component: React.FC<{
    card: TCard;
    userId?: string;
    onAction?: (action: CardAction) => void;
  }>;
  FormComponent: React.FC<{
    onSubmit: (data: TCard) => void;
    onCancel: () => void;
  }>;
  actionHandler?: CardActionHandler<TCard>;
}
