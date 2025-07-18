import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PollCreationModal from './PollCreationModal';

describe('PollCreationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnCreateCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    expect(screen.getByText('Create Poll Card')).toBeInTheDocument();
    expect(screen.getByLabelText('Poll Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Options *')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <PollCreationModal
        isOpen={false}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    expect(screen.queryByText('Create Poll Card')).not.toBeInTheDocument();
  });

  it('renders default two option inputs', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Option 2')).toBeInTheDocument();
  });

  it('allows adding new options', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const addButton = screen.getByText('Add Option');
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText('Option 3')).toBeInTheDocument();
  });

  it('allows removing options when more than 2 exist', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    // Add a third option
    const addButton = screen.getByText('Add Option');
    fireEvent.click(addButton);

    // Remove buttons should appear
    const removeButtons = screen.getAllByRole('button', { name: 'Remove option' });
    expect(removeButtons).toHaveLength(3);

    // Remove the third option
    fireEvent.click(removeButtons[2]);

    expect(screen.queryByPlaceholderText('Option 3')).not.toBeInTheDocument();
  });

  it('does not show remove buttons when only 2 options exist', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const removeButtons = screen.queryAllByRole('button', { name: 'Remove option' });
    expect(removeButtons).toHaveLength(0);
  });

  it('creates poll card on valid form submission', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const titleInput = screen.getByLabelText('Poll Title *');
    const option1Input = screen.getByPlaceholderText('Option 1');
    const option2Input = screen.getByPlaceholderText('Option 2');
    const createButton = screen.getByText('Create Poll');

    fireEvent.change(titleInput, { target: { value: 'Test Poll' } });
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    fireEvent.click(createButton);

    expect(mockOnCreateCard).toHaveBeenCalledWith({
      type: 'poll',
      title: 'Test Poll',
      options: ['Option A', 'Option B'],
      votes: {},
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error when title is empty', async () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const option1Input = screen.getByPlaceholderText('Option 1');
    const option2Input = screen.getByPlaceholderText('Option 2');
    const createButton = screen.getByText('Create Poll');

    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    expect(mockOnCreateCard).not.toHaveBeenCalled();
  });

  it('shows error when less than 2 options are provided', async () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const titleInput = screen.getByLabelText('Poll Title *');
    const option1Input = screen.getByPlaceholderText('Option 1');
    const createButton = screen.getByText('Create Poll');

    fireEvent.change(titleInput, { target: { value: 'Test Poll' } });
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    // Leave option 2 empty

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('At least 2 options are required')).toBeInTheDocument();
    });
    expect(mockOnCreateCard).not.toHaveBeenCalled();
  });

  it('closes modal when cancel button is clicked', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when X button is clicked', () => {
    render(
      <PollCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});