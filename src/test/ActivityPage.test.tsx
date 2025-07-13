import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityPage from '../react-app/components/ActivityPage';

// Mock the useActivityRoom hook
vi.mock('../react-app/hooks/useActivityRoom', () => ({
  useActivityRoom: vi.fn(() => ({
    activity: {
      id: 'test-id',
      name: 'Test Activity',
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      questions: {}
    },
    loading: false,
    createQuestion: vi.fn(),
    submitVote: vi.fn(),
    updateName: vi.fn(),
    updateDates: vi.fn(),
    isConnected: true
  }))
}));

// Mock the useSession hook
vi.mock('@hono/auth-js/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  }))
}));

// Mock react-router
vi.mock('react-router', () => ({
  useParams: vi.fn(() => ({ activityId: 'test-activity-id' })),
  useNavigate: vi.fn(() => vi.fn())
}));

describe('ActivityPage', () => {
  it('renders activity title and allows editing', async () => {
    const user = userEvent.setup();
    render(<ActivityPage />);

    // Check that the title is displayed
    expect(screen.getByText('Test Activity')).toBeInTheDocument();

    // Click on the title to edit
    await user.click(screen.getByText('Test Activity'));

    // Check that edit mode is active
    expect(screen.getByPlaceholderText('Enter activity name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('cancels editing when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityPage />);

    // Click on the title to edit
    await user.click(screen.getByText('Test Activity'));

    // Type some text
    const input = screen.getByPlaceholderText('Enter activity name');
    await user.clear(input);
    await user.type(input, 'New Activity Name');

    // Click Cancel
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Check that edit mode is closed and original name is displayed
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter activity name')).not.toBeInTheDocument();
  });

  it('cancels editing when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<ActivityPage />);

    // Click on the title to edit
    await user.click(screen.getByText('Test Activity'));

    // Type some text
    const input = screen.getByPlaceholderText('Enter activity name');
    await user.clear(input);
    await user.type(input, 'New Activity Name');

    // Press Escape key
    await user.keyboard('{Escape}');

    // Check that edit mode is closed and original name is displayed
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter activity name')).not.toBeInTheDocument();
  });
});