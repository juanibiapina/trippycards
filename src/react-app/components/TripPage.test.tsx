import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils";
import TripPage from "./TripPage";

// Mock the fetch function
global.fetch = vi.fn();

describe("TripPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ name: "Test Trip" }),
    } as unknown as Response);

    render(<TripPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the async operations to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.getByText("Test Trip")).toBeInTheDocument();
    });
  });

  it("displays TripNameForm when trip has no name (fresh trip)", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ fresh: true }),
    } as unknown as Response);

    render(<TripPage />);

    await waitFor(() => {
      expect(screen.getByText("Name Your Trip")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("displays trip name when data is loaded successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        name: "Red Rock Climbing Adventure",
        fresh: false,
        owner: "user@example.com"
      }),
    } as unknown as Response);

    render(<TripPage />);

    await waitFor(() => {
      expect(screen.getByText("Red Rock Climbing Adventure")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TripPage />);

    await waitFor(() => {
      expect(screen.getByText("We couldn't load your trip. Please try again.")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching trip:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
