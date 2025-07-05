import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils";
import TripCard from "./TripCard";

// Mock the fetch function
global.fetch = vi.fn();

describe("TripCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ name: "Test Trip" }),
    } as unknown as Response);

    render(<TripCard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the async operations to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.getByText("Test Trip")).toBeInTheDocument();
    });
  });

  it("displays trip name when data is loaded successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ name: "Red Rock Climbing Adventure" }),
    } as unknown as Response);

    render(<TripCard />);

    await waitFor(() => {
      expect(screen.getByText("Red Rock Climbing Adventure")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/1");
  });

  it("displays error message when fetch fails", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TripCard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load trip")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching trip:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
