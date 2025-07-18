import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PollCard from './PollCard';
import { PollCard as PollCardType } from '../../../shared';

describe('PollCard', () => {
  const mockOnVote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const samplePollCard: PollCardType = {
    id: 'poll-1',
    type: 'poll',
    title: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green'],
    votes: {
      'user1@example.com': 'Red',
      'user2@example.com': 'Blue',
      'user3@example.com': 'Red',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  it('renders poll card with title and options', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} />);

    expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('displays vote counts and percentages', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} />);

    expect(screen.getByText('3 votes')).toBeInTheDocument();
    expect(screen.getByText('2 (67%)')).toBeInTheDocument(); // Red: 2 votes
    expect(screen.getByText('1 (33%)')).toBeInTheDocument(); // Blue: 1 vote
    expect(screen.getByText('0 (0%)')).toBeInTheDocument(); // Green: 0 votes
  });

  it('highlights user vote when currentUserId is provided', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} currentUserId="user1@example.com" />);

    const redButton = screen.getByText('Red').closest('button');
    const blueButton = screen.getByText('Blue').closest('button');

    expect(redButton).toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-900');
    expect(blueButton).not.toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-900');
  });

  it('calls onVote when option is clicked', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} currentUserId="user4@example.com" />);

    const redButton = screen.getByText('Red').closest('button');
    fireEvent.click(redButton!);

    expect(mockOnVote).toHaveBeenCalledWith('poll-1', 'Red');
  });

  it('does not call onVote when no currentUserId is provided', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} />);

    const redButton = screen.getByText('Red').closest('button');
    fireEvent.click(redButton!);

    expect(mockOnVote).not.toHaveBeenCalled();
  });

  it('displays sign in message when no currentUserId', () => {
    render(<PollCard card={samplePollCard} onVote={mockOnVote} />);

    expect(screen.getByText('Sign in to vote')).toBeInTheDocument();
  });

  it('handles poll with no votes', () => {
    const pollWithNoVotes: PollCardType = {
      ...samplePollCard,
      votes: {},
    };

    render(<PollCard card={pollWithNoVotes} onVote={mockOnVote} />);

    expect(screen.getByText('0 votes')).toBeInTheDocument();
    expect(screen.getAllByText('0 (0%)')).toHaveLength(3); // One for each option
  });
});