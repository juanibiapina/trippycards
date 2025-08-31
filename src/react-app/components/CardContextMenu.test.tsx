import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardContextMenu from './CardContextMenu';

describe('CardContextMenu', () => {
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders context menu button', () => {
    render(<CardContextMenu onDelete={mockOnDelete} />);

    expect(screen.getByRole('button', { name: 'Card options' })).toBeInTheDocument();
  });

  it('opens menu when button is clicked', () => {
    render(<CardContextMenu onDelete={mockOnDelete} />);

    const button = screen.getByRole('button', { name: 'Card options' });
    fireEvent.click(button);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows confirmation dialog when Delete is clicked and calls onDelete when confirmed', () => {
    render(<CardContextMenu onDelete={mockOnDelete} />);

    const button = screen.getByRole('button', { name: 'Card options' });
    fireEvent.click(button);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirmation dialog should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Click the Delete button in the confirmation dialog
    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmDeleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('closes menu and shows confirmation dialog when Delete is clicked', () => {
    render(<CardContextMenu onDelete={mockOnDelete} />);

    const button = screen.getByRole('button', { name: 'Card options' });
    fireEvent.click(button);

    // Verify menu is open
    expect(screen.getByText('Delete')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Menu should be closed (Delete button in menu should not be visible)
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();

    // Confirmation dialog should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes menu when clicking outside', () => {
    render(<CardContextMenu onDelete={mockOnDelete} />);

    const button = screen.getByRole('button', { name: 'Card options' });
    fireEvent.click(button);

    expect(screen.getByText('Delete')).toBeInTheDocument();

    // Click outside the menu
    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});