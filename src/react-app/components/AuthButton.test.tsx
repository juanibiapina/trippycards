import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils";
import AuthButton from "./AuthButton";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("AuthButton", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock window.location for the tests
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        reload: vi.fn()
      },
      writable: true
    });
  });

  it("shows loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<AuthButton />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows sign in button when not authenticated", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<AuthButton />);

    await waitFor(() => {
      expect(screen.getByText("You are not signed in.")).toBeInTheDocument();
      expect(screen.getByText("Sign In with GitHub")).toBeInTheDocument();
    });
  });

  it("shows user info and sign out button when authenticated", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          name: "John Doe",
          email: "john@example.com"
        }
      })
    });

    render(<AuthButton />);

    await waitFor(() => {
      expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });

  it("handles session fetch error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AuthButton />);

    await waitFor(() => {
      expect(screen.getByText("You are not signed in.")).toBeInTheDocument();
    });
  });
});