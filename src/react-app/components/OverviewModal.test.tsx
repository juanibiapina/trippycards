import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OverviewModal from './OverviewModal';

interface Question {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  responses: Record<string, 'yes' | 'no'>;
}

describe('OverviewModal', () => {
  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Test question 1',
      createdAt: '2025-01-01T00:00:00Z',
      createdBy: 'user1@example.com',
      responses: { user1: 'yes', user2: 'no', user3: 'yes' }
    },
    {
      id: '2',
      text: 'Test question 2',
      createdAt: '2025-01-01T01:00:00Z',
      createdBy: 'user2@example.com',
      responses: {}
    }
  ];

  it('does not render when isOpen is false', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('displays questions with their details', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Test question 1')).toBeInTheDocument();
    expect(screen.getByText('Test question 2')).toBeInTheDocument();
    expect(screen.getByText('by user1@example.com • 1/1/2025')).toBeInTheDocument();
  });

  it('displays vote counts correctly', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Yes: 2')).toBeInTheDocument();
    expect(screen.getByText('No: 1')).toBeInTheDocument();
    expect(screen.getByText('Total: 3')).toBeInTheDocument();
  });

  it('shows "No responses yet" for questions without responses', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('No responses yet')).toBeInTheDocument();
  });

  it('shows empty state when no questions exist', () => {
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={[]} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('No questions yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first question to get started!')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    render(<OverviewModal questions={mockQuestions} isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByRole('button', { name: 'Close overview' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});