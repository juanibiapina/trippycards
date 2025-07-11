import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils";
import ActivityPage from "./ActivityPage";
import { useSession } from '@hono/auth-js/react';
import { useNavigate } from 'react-router';

// Mock the dependencies
vi.mock('@hono/auth-js/react', () => ({
  useSession: vi.fn(),
}));

vi.mock('react-router', () => ({
  useParams: vi.fn(() => ({ activityId: 'test-activity-id' })),
  useNavigate: vi.fn(),
}));

// Mock the fetch function
global.fetch = vi.fn();

describe("ActivityPage", () => {
  const mockNavigate = vi.fn();
  const mockUseSession = vi.mocked(useSession);
  const mockUseNavigate = vi.mocked(useNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  it("redirects to home when user is not authenticated", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn()
    });

    render(<ActivityPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it("renders nothing while not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn()
    });

    const { container } = render(<ActivityPage />);

    expect(container.firstChild).toBeNull();
  });

  it("shows loading state when authenticated", async () => {
    const mockSession = {
      user: { email: 'test@example.com', name: 'Test User' },
      expires: '2025-01-01T00:00:00Z'
    };
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: vi.fn()
    });

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ questions: {} }),
    } as unknown as Response);

    render(<ActivityPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.getByText("Activity Questions")).toBeInTheDocument();
    });
  });

  it("displays activity content when authenticated and data is loaded", async () => {
    const mockSession = {
      user: { email: 'test@example.com', name: 'Test User' },
      expires: '2025-01-01T00:00:00Z'
    };
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
      update: vi.fn()
    });

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        questions: {
          'question-1': {
            id: 'question-1',
            text: 'Can you lead climb?',
            createdBy: 'test@example.com',
            createdAt: '2023-01-01T00:00:00Z',
            responses: {}
          }
        }
      }),
    } as unknown as Response);

    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText("Activity Questions")).toBeInTheDocument();
      expect(screen.getByText("Create a new question")).toBeInTheDocument();
    });
  });
});