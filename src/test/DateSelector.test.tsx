import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateSelector from '../react-app/components/DateSelector';

describe('DateSelector', () => {
  it('renders initial state with placeholder text', () => {
    const mockOnDateChange = vi.fn();
    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText('Select activity date')).toBeInTheDocument();
    expect(screen.getByText('Please select an activity date.')).toBeInTheDocument();
  });

  it('shows existing dates when provided', () => {
    const mockOnDateChange = vi.fn();
    render(
      <DateSelector
        startDate="2025-07-16"
        endDate="2025-07-18"
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText('Jul 16, 2025 – Jul 18, 2025')).toBeInTheDocument();
    expect(screen.queryByText('Please select an activity date.')).not.toBeInTheDocument();
  });

  it('shows only start date when no end date provided', () => {
    const mockOnDateChange = vi.fn();
    render(
      <DateSelector
        startDate="2025-07-16"
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText('Jul 16, 2025')).toBeInTheDocument();
    expect(screen.queryByText('Please select an activity date.')).not.toBeInTheDocument();
  });

  it('opens date picker when clicking the date selector', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    expect(screen.getByLabelText('Activity Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date (Optional)')).toBeInTheDocument();
  });

  it('validates required start date', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));
    await user.click(screen.getByText('Save'));

    expect(screen.getByText('Please select an activity date.')).toBeInTheDocument();
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('validates end date cannot be before start date', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');
    const endDateInput = screen.getByLabelText('End Date (Optional)');

    await user.type(startDateInput, '2025-07-20');
    await user.type(endDateInput, '2025-07-18');
    await user.click(screen.getByText('Save'));

    expect(screen.getByText('End date cannot be before the activity date.')).toBeInTheDocument();
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('calls onDateChange with valid dates', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');
    const endDateInput = screen.getByLabelText('End Date (Optional)');

    await user.type(startDateInput, '2025-07-16');
    await user.type(endDateInput, '2025-07-18');
    await user.click(screen.getByText('Save'));

    expect(mockOnDateChange).toHaveBeenCalledWith('2025-07-16', '2025-07-18');
  });

  it('calls onDateChange with only start date when end date is empty', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');

    await user.type(startDateInput, '2025-07-16');
    await user.click(screen.getByText('Save'));

    expect(mockOnDateChange).toHaveBeenCalledWith('2025-07-16', undefined);
  });

  it('cancels date selection and resets form', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        startDate="2025-07-16"
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');
    await user.clear(startDateInput);
    await user.type(startDateInput, '2025-07-20');

    await user.click(screen.getByText('Cancel'));

    expect(screen.getByText('Jul 16, 2025')).toBeInTheDocument();
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('handles keyboard shortcuts', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');
    await user.type(startDateInput, '2025-07-16');

    fireEvent.keyDown(startDateInput, { key: 'Enter' });

    expect(mockOnDateChange).toHaveBeenCalledWith('2025-07-16', undefined);
  });

  it('handles Escape key to cancel', async () => {
    const mockOnDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateSelector
        startDate="2025-07-16"
        onDateChange={mockOnDateChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /select activity date/i }));

    const startDateInput = screen.getByLabelText('Activity Date *');
    fireEvent.keyDown(startDateInput, { key: 'Escape' });

    expect(screen.getByText('Jul 16, 2025')).toBeInTheDocument();
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnDateChange = vi.fn();
    render(
      <DateSelector
        onDateChange={mockOnDateChange}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /select activity date/i });
    expect(button).toBeDisabled();
  });
});