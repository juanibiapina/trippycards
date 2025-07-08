import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../test/utils";
import CardForm from "./CardForm";

// Mock react-router
const mockParams = { tripId: "123", cardId: "new" };
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = vi.fn();

describe("CardForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders new card form correctly", () => {
    render(<CardForm />);

    expect(screen.getByText("New Card")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter card title...")).toBeInTheDocument();
    expect(screen.getByText("Create Card")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("allows entering card title", () => {
    render(<CardForm />);

    const input = screen.getByPlaceholderText("Enter card title...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My New Card" } });

    expect(input.value).toBe("My New Card");
  });

  it("shows error when submitting empty form", async () => {
    render(<CardForm />);

    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Please enter a card title")).toBeInTheDocument();
    });
  });

  it("makes API call when form is submitted successfully", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: "new-card-id", title: "My New Card" }),
    } as unknown as Response);

    render(<CardForm />);

    const input = screen.getByPlaceholderText("Enter card title...");
    const submitButton = screen.getByText("Create Card");

    fireEvent.change(input, { target: { value: "My New Card" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/123/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "My New Card" }),
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/trips/123");
    });
  });

  it("handles cancel button correctly", () => {
    render(<CardForm />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/trips/123");
  });

  it("shows error message when API call fails", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CardForm />);

    const input = screen.getByPlaceholderText("Enter card title...");
    const submitButton = screen.getByText("Create Card");

    fireEvent.change(input, { target: { value: "My New Card" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to save card. Please try again.")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});