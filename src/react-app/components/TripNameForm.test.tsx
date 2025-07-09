import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../test/utils";
import TripNameForm from "./TripNameForm";

// Mock react-router
const mockParams = { tripId: "123" };
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

describe("TripNameForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<TripNameForm />);

    expect(screen.getByText("Name Your Trip")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter trip name...")).toBeInTheDocument();
    expect(screen.getByText("Let's Go!")).toBeInTheDocument();
  });

  it("updates input value when user types", () => {
    render(<TripNameForm />);

    const input = screen.getByPlaceholderText("Enter trip name...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My Trip" } });

    expect(input.value).toBe("My Trip");
  });

  it("enables submit button regardless of input value", () => {
    render(<TripNameForm />);

    const submitButton = screen.getByText("Let's Go!") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it("shows error when submitting empty form", async () => {
    render(<TripNameForm />);

    // Find the form element and submit it directly
    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Please enter a trip name")).toBeInTheDocument();
    });
  });

  it("makes API call when form is submitted successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as Response);

    render(<TripNameForm />);

    const input = screen.getByPlaceholderText("Enter trip name...");
    const submitButton = screen.getByText("Let's Go!");

    fireEvent.change(input, { target: { value: "My Amazing Trip" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/123", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "My Amazing Trip" }),
      });
    });

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("shows error message when API call fails", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<TripNameForm />);

    const input = screen.getByPlaceholderText("Enter trip name...");
    const submitButton = screen.getByText("Let's Go!");

    fireEvent.change(input, { target: { value: "My Trip" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to save trip name. Please try again.")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("shows loading state during submission", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<TripNameForm />);

    const input = screen.getByPlaceholderText("Enter trip name...");
    const submitButton = screen.getByText("Let's Go!") as HTMLButtonElement;

    fireEvent.change(input, { target: { value: "My Trip" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    expect(submitButton.disabled).toBe(true);
  });
});