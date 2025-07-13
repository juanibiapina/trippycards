import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import BottomBar from './BottomBar';

// Helper function to render BottomBar with router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BottomBar', () => {
  it('renders the Overview button', () => {
    renderWithRouter(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toBeInTheDocument();
  });

  it('renders the Questions button', () => {
    renderWithRouter(<BottomBar />);

    const questionsButton = screen.getByRole('button', { name: 'Questions' });
    expect(questionsButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    const questionsButton = screen.getByRole('button', { name: 'Questions' });

    expect(overviewButton).toHaveAttribute('aria-label', 'Overview');
    expect(questionsButton).toHaveAttribute('aria-label', 'Questions');
  });

  it('renders with proper fixed positioning classes', () => {
    renderWithRouter(<BottomBar />);

    const bottomBar = screen.getByRole('button', { name: 'Overview' }).closest('div[class*="fixed"]');
    expect(bottomBar).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });

  it('has mobile-friendly touch targets', () => {
    renderWithRouter(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    const questionsButton = screen.getByRole('button', { name: 'Questions' });

    expect(overviewButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    expect(questionsButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
  });

  it('can be clicked without errors', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    const questionsButton = screen.getByRole('button', { name: 'Questions' });

    await user.click(overviewButton);
    await user.click(questionsButton);

    // Should not throw any errors
    expect(overviewButton).toBeInTheDocument();
    expect(questionsButton).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    renderWithRouter(<BottomBar className="custom-class" />);

    const bottomBar = screen.getByRole('button', { name: 'Overview' }).closest('div[class*="fixed"]');
    expect(bottomBar).toHaveClass('custom-class');
  });
});