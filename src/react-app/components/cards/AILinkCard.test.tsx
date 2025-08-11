import { render, screen } from '@testing-library/react';
import { AILinkCard } from './AILinkCard';
import type { AILinkCard as AILinkCardType } from '../../../shared';

describe('AILinkCard', () => {
  const mockCard: AILinkCardType = {
    id: 'test-id',
    type: 'ailink',
    url: 'https://example.com',
    title: 'Test AILink Card',
    description: 'Test description',
    status: 'processing',
    createdAt: '2025-01-11T00:00:00Z',
    updatedAt: '2025-01-11T00:00:00Z',
  };

  it('renders processing status correctly', () => {
    render(<AILinkCard card={mockCard} />);

    expect(screen.getByText('Test AILink Card')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('renders completed status correctly', () => {
    const completedCard = { ...mockCard, status: 'completed' as const };
    render(<AILinkCard card={completedCard} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders error status correctly', () => {
    const errorCard = { ...mockCard, status: 'error' as const };
    render(<AILinkCard card={errorCard} />);

    expect(screen.getByText('Error processing URL')).toBeInTheDocument();
  });

  it('renders fallback title when none provided', () => {
    const cardWithoutTitle = { ...mockCard, title: undefined };
    render(<AILinkCard card={cardWithoutTitle} />);

    expect(screen.getByText('AI Link Card')).toBeInTheDocument();
  });

  it('does not render description when none provided', () => {
    const cardWithoutDescription = { ...mockCard, description: undefined };
    render(<AILinkCard card={cardWithoutDescription} />);

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });
});