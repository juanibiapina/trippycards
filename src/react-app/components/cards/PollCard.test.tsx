import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PollCard from './PollCard';
import { PollCard as PollCardType } from '../../../shared';

describe('PollCard', () => {
  const mockPollCard: PollCardType = {
    id: 'poll-1',
    type: 'poll',
    question: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green'],
    votes: {
      '0': { 'user1': 'John' },
      '1': { 'user2': 'Jane', 'user3': 'Bob' },
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockOnVote = vi.fn();

  beforeEach(() => {
    mockOnVote.mockClear();
  });

  it('renders poll question and options', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('displays vote counts correctly', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    expect(screen.getByText('1 (33%)')).toBeInTheDocument(); // Red
    expect(screen.getByText('2 (67%)')).toBeInTheDocument(); // Blue
    expect(screen.getByText('0 (0%)')).toBeInTheDocument(); // Green
  });

  it('shows user vote selection', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    expect(screen.getByText('✓ Your vote')).toBeInTheDocument();
  });

  it('calls onVote when option is clicked', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    const greenButton = screen.getByRole('button', { name: /Green.*0.*0%/ });
    fireEvent.click(greenButton);

    expect(mockOnVote).toHaveBeenCalledWith('poll-1', 2, 'user1', 'John');
  });

  it('displays total vote count', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    expect(screen.getByText('3 votes')).toBeInTheDocument();
  });

  it('handles no votes gracefully', () => {
    const emptyPollCard: PollCardType = {
      ...mockPollCard,
      votes: {},
    };

    render(
      <PollCard
        card={emptyPollCard}
        onVote={mockOnVote}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    expect(screen.getByText('0 votes')).toBeInTheDocument();
    expect(screen.getAllByText('0 (0%)')[0]).toBeInTheDocument();
  });

  it('disables voting when no onVote handler provided', () => {
    render(
      <PollCard
        card={mockPollCard}
        currentUserId="user1"
        currentUserName="John"
      />
    );

    const redButton = screen.getByRole('button', { name: /Red.*1.*33%/ });
    expect(redButton).toBeDisabled();
  });

  it('disables voting when no current user', () => {
    render(
      <PollCard
        card={mockPollCard}
        onVote={mockOnVote}
      />
    );

    const redButton = screen.getByRole('button', { name: /Red.*1.*33%/ });
    expect(redButton).toBeDisabled();
  });
});