import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardsList from './CardsList';
import { Card, LinkCard } from '../../../shared';

describe('CardsList', () => {
  it('renders empty state when no cards', () => {
    render(<CardsList cards={[]} />);
    
    expect(screen.getByText('No cards yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first card to get started')).toBeInTheDocument();
  });

  it('renders link cards', () => {
    const linkCard: LinkCard = {
      id: '1',
      type: 'link',
      url: 'https://example.com',
      title: 'Example Title',
      description: 'Example description',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    render(<CardsList cards={[linkCard]} />);
    
    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText('Example description')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('renders unknown card type', () => {
    const unknownCard: Card = {
      id: '2',
      type: 'unknown',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    render(<CardsList cards={[unknownCard]} />);
    
    expect(screen.getByText('Unknown card type: unknown')).toBeInTheDocument();
  });

  it('renders multiple cards', () => {
    const cards: Card[] = [
      {
        id: '1',
        type: 'link',
        url: 'https://example1.com',
        title: 'Title 1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      } as LinkCard,
      {
        id: '2',
        type: 'link',
        url: 'https://example2.com',
        title: 'Title 2',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      } as LinkCard
    ];

    render(<CardsList cards={cards} />);
    
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
    expect(screen.getByText('https://example1.com')).toBeInTheDocument();
    expect(screen.getByText('https://example2.com')).toBeInTheDocument();
  });
});