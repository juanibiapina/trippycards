import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import ActivityPage from './ActivityPage';

// Mock the useSession hook
vi.mock('@hono/auth-js/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  }))
}));

// Mock react-router
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Component</div>)
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ActivityPage', () => {
  it('renders outlet when authenticated', () => {
    renderWithRouter(<ActivityPage />);

    // Check that the outlet is rendered
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('handles authentication states correctly', () => {
    // This is a basic test to ensure the component doesn't crash
    // and renders the outlet when authenticated
    renderWithRouter(<ActivityPage />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
