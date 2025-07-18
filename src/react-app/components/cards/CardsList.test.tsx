import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardsList from './CardsList';
import { Card, LinkCard, PollCard } from '../../../shared';

describe('CardsList', () => {
  const mockOnEditCard = vi.fn();
  const mockOnDeleteCard = vi.fn();
  const mockOnVote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no cards', () => {
    render(<CardsList cards={[]} onEditCard={mockOnEditCard} onDeleteCard={mockOnDeleteCard} onVote={mockOnVote} />);

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

    render(<CardsList cards={[linkCard]} onEditCard={mockOnEditCard} onDeleteCard={mockOnDeleteCard} onVote={mockOnVote} />);

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

    render(<CardsList cards={[unknownCard]} onEditCard={mockOnEditCard} onDeleteCard={mockOnDeleteCard} onVote={mockOnVote} />);

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

    render(<CardsList cards={cards} onEditCard={mockOnEditCard} onDeleteCard={mockOnDeleteCard} onVote={mockOnVote} />);

    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
    expect(screen.getByText('https://example1.com')).toBeInTheDocument();
    expect(screen.getByText('https://example2.com')).toBeInTheDocument();
  });

  it('renders poll cards', () => {
    const pollCard: PollCard = {
      id: '1',
      type: 'poll',
      title: 'What is your favorite color?',
      options: ['Red', 'Blue', 'Green'],
      votes: { 'user1@example.com': 'Red' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    render(<CardsList cards={[pollCard]} onEditCard={mockOnEditCard} onDeleteCard={mockOnDeleteCard} onVote={mockOnVote} />);

    expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });
});