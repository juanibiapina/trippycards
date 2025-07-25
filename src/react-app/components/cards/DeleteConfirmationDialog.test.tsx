import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

describe('DeleteConfirmationDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Delete Card')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen is true', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Delete Card')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this card? This permanent removal cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Custom Title"
        message="Custom message"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});