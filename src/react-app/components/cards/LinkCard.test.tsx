import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LinkCard from './LinkCard';
import { validateUrl } from '../../utils/urlValidation';
import { LinkCard as LinkCardType } from '../../../shared';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockOpen });

describe('LinkCard', () => {
  const mockCard: LinkCardType = {
    id: '1',
    type: 'link',
    url: 'https://example.com',
    title: 'Example Title',
    description: 'Example description',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders link card with all elements', () => {
    render(<LinkCard card={mockCard} />);

    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText('Example description')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Example Title/i })).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
  });

  it('renders link card without optional elements', () => {
    const minimalCard: LinkCardType = {
      id: '2',
      type: 'link',
      url: 'https://minimal.com',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    render(<LinkCard card={minimalCard} />);

    expect(screen.getByText('https://minimal.com')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('opens link in new tab when clicked', () => {
    render(<LinkCard card={mockCard} />);

    const linkElement = screen.getByText('https://example.com');
    fireEvent.click(linkElement);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('prevents default link behavior', () => {
    render(<LinkCard card={mockCard} />);

    const linkElement = screen.getByText('https://example.com');
    const mockPreventDefault = vi.fn();

    // Create a proper event object
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'preventDefault', { value: mockPreventDefault });

    fireEvent(linkElement, clickEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});

describe('validateUrl', () => {
  it('validates valid URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(true);
    expect(validateUrl('https://example.com/path')).toBe(true);
    expect(validateUrl('https://subdomain.example.com')).toBe(true);
  });

  it('invalidates invalid URLs', () => {
    expect(validateUrl('invalid-url')).toBe(false);
    expect(validateUrl('just-text')).toBe(false);
    expect(validateUrl('')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(true); // FTP is valid URL
  });

  it('handles edge cases', () => {
    expect(validateUrl('https://')).toBe(false);
    expect(validateUrl('http://')).toBe(false);
    expect(validateUrl('https://example')).toBe(true); // Valid but not typical
  });
});