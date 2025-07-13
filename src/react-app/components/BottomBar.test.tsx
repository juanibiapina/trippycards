import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomBar from './BottomBar';

describe('BottomBar', () => {
  const mockQuestions = [
    {
      id: '1',
      text: 'Test question 1',
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'user1@example.com',
      responses: { user1: 'yes', user2: 'no' }
    },
    {
      id: '2',
      text: 'Test question 2',
      createdAt: '2025-01-01T01:00:00Z',
      createdBy: 'user2@example.com',
      responses: {}
    }
  ];

  it('renders the Overview button', () => {
    const mockOnOverviewClick = vi.fn();
    render(<BottomBar questions={[]} onOverviewClick={mockOnOverviewClick} />);

    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('displays question count badge when there are questions', () => {
    const mockOnOverviewClick = vi.fn();
    render(<BottomBar questions={mockQuestions} onOverviewClick={mockOnOverviewClick} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not display question count badge when there are no questions', () => {
    const mockOnOverviewClick = vi.fn();
    render(<BottomBar questions={[]} onOverviewClick={mockOnOverviewClick} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onOverviewClick when Overview button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnOverviewClick = vi.fn();
    render(<BottomBar questions={mockQuestions} onOverviewClick={mockOnOverviewClick} />);

    await user.click(screen.getByRole('button', { name: 'Overview' }));

    expect(mockOnOverviewClick).toHaveBeenCalledTimes(1);
  });
});