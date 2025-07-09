import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../test/utils";
import CardEditPage from "./CardEditPage";

// Mock react-router
const mockNavigate = vi.fn();
const mockParams = { tripId: "123", cardId: "card-456" };
vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = vi.fn();

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
  },
  writable: true,
});

describe("CardEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders new card form correctly", async () => {
    // Set up for new card
    mockParams.cardId = "new";
    
    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("New Card")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter card title")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("creates new card when form is submitted", async () => {
    // Set up for new card
    mockParams.cardId = "new";
    
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as Response);

    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("New Card")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    const saveButton = screen.getByText("Save");

    fireEvent.change(titleInput, { target: { value: "Test Card Title" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/123/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "test-uuid-123",
          title: "Test Card Title",
        }),
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/trips/123");
  });

  it("loads existing card for editing", async () => {
    // Set up for existing card
    mockParams.cardId = "card-456";
    
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: "card-456", title: "Existing Card" }),
    } as unknown as Response);

    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("Edit Card")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/123/cards/card-456");
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
      expect(titleInput.value).toBe("Existing Card");
    });
  });

  it("updates existing card when form is submitted", async () => {
    // Set up for existing card
    mockParams.cardId = "card-456";
    
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: "card-456", title: "Existing Card" }),
    } as unknown as Response);

    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("Edit Card")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    const saveButton = screen.getByText("Save");

    fireEvent.change(titleInput, { target: { value: "Updated Card Title" } });

    // Mock the PUT request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as Response);

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/trips/v2/123/cards/card-456", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Updated Card Title",
        }),
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/trips/123");
  });

  it("shows error when title is empty", async () => {
    // Set up for new card
    mockParams.cardId = "new";
    
    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("New Card")).toBeInTheDocument();
    });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates back when cancel is clicked", async () => {
    // Set up for new card
    mockParams.cardId = "new";
    
    render(<CardEditPage />);

    await waitFor(() => {
      expect(screen.getByText("New Card")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/trips/123");
  });
});