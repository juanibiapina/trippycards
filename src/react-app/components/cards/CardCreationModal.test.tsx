import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardCreationModal from './CardCreationModal';

describe('CardCreationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnCreateCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    expect(screen.getByText('Create Link Card')).toBeInTheDocument();
    expect(screen.getByLabelText('URL *')).toBeInTheDocument();
    expect(screen.getByLabelText('Title (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL (optional)')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CardCreationModal
        isOpen={false}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    expect(screen.queryByText('Create Link Card')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button is clicked', () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '' })); // X button
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('validates URL input', async () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const urlInput = screen.getByLabelText('URL *');
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
  });

  it('creates card with valid data', async () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const urlInput = screen.getByLabelText('URL *');
    const titleInput = screen.getByLabelText('Title (optional)');
    const descriptionInput = screen.getByLabelText('Description (optional)');

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const createButton = screen.getByText('Create Card');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockOnCreateCard).toHaveBeenCalledWith({
        type: 'link',
        url: 'https://example.com',
        title: 'Test Title',
        description: 'Test Description',
        imageUrl: undefined
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('prevents submission with invalid URL', async () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const urlInput = screen.getByLabelText('URL *');
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    const createButton = screen.getByText('Create Card');
    expect(createButton).toBeDisabled();
  });

  it('prevents submission with empty URL', () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const createButton = screen.getByText('Create Card');
    expect(createButton).toBeDisabled();
  });

  it('resets form on close', async () => {
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const urlInput = screen.getByLabelText('URL *') as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Reopen the modal
    render(
      <CardCreationModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateCard={mockOnCreateCard}
      />
    );

    const newUrlInput = screen.getByLabelText('URL *') as HTMLInputElement;
    expect(newUrlInput.value).toBe('');
  });
});