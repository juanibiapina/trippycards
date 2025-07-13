import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomBar from './BottomBar';

describe('BottomBar', () => {
  it('renders the Overview button', () => {
    render(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toBeInTheDocument();
    expect(overviewButton).toHaveClass('text-gray-800', 'bg-gray-100'); // Active state
  });

  it('has proper accessibility attributes', () => {
    render(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toHaveAttribute('aria-label', 'Overview');
  });

  it('renders with proper fixed positioning classes', () => {
    render(<BottomBar />);

    const bottomBar = screen.getByRole('button', { name: 'Overview' }).closest('div[class*="fixed"]');
    expect(bottomBar).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });

  it('has mobile-friendly touch targets', () => {
    render(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    expect(overviewButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
  });

  it('can be clicked without errors', async () => {
    const user = userEvent.setup();
    render(<BottomBar />);

    const overviewButton = screen.getByRole('button', { name: 'Overview' });
    await user.click(overviewButton);

    // Should not throw any errors
    expect(overviewButton).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<BottomBar className="custom-class" />);

    const bottomBar = screen.getByRole('button', { name: 'Overview' }).closest('div[class*="fixed"]');
    expect(bottomBar).toHaveClass('custom-class');
  });
});