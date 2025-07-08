import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils";
import TripPage from "./TripPage";

// Mock react-router
const mockParams = { tripId: "123" };
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

// Mock the fetch function
global.fetch = vi.fn();

describe("TripPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ name: "Test Trip", cards: [] }),
    } as unknown as Response);

    render(<TripPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the async operations to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.getByText("Test Trip")).toBeInTheDocument();
    });
  });

  it("displays trip name when data is loaded successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ name: "Red Rock Climbing Adventure", cards: [] }),
    } as unknown as Response);

    render(<TripPage />);

    await waitFor(() => {
      expect(screen.getByText("Red Rock Climbing Adventure")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("+ New Card")).toBeInTheDocument();
    expect(screen.getByText("No cards yet")).toBeInTheDocument();
  });

  it("displays cards when they exist", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        name: "My Trip",
        cards: [
          { id: "card-1", title: "Restaurant Reservation" },
          { id: "card-2", title: "Hotel Booking" }
        ]
      }),
    } as unknown as Response);

    render(<TripPage />);

    await waitFor(() => {
      expect(screen.getByText("My Trip")).toBeInTheDocument();
    });

    expect(screen.getByText("Restaurant Reservation")).toBeInTheDocument();
    expect(screen.getByText("Hotel Booking")).toBeInTheDocument();
    expect(screen.getByText("+ New Card")).toBeInTheDocument();
    expect(screen.queryByText("No cards yet")).not.toBeInTheDocument();
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
