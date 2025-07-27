import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import OverviewPage from './OverviewPage';
import { useActivityRoom } from '../hooks/useActivityRoom';

// Mock the useSession hook
vi.mock('@hono/auth-js/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { id: 'user123', email: 'test@example.com' } },
    status: 'authenticated'
  }))
}));

// Mock react-router hooks
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useParams: vi.fn(() => ({ activityId: 'activity123' })),
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/activities/activity123', search: '' }))
  };
});

// Mock the useActivityRoom hook
vi.mock('../hooks/useActivityRoom');

// Mock components to avoid complex rendering issues
vi.mock('../components/LoadingCard', () => ({
  default: () => <div data-testid="loading-card">Loading...</div>
}));

vi.mock('../components/ActivityHeader', () => ({
  default: ({ activityName }: { activityName?: string }) =>
    <div data-testid="activity-header">{activityName || 'No Name'}</div>
}));

vi.mock('../components/cards/CardsList', () => ({
  default: () => <div data-testid="cards-list">Cards List</div>
}));

vi.mock('../components/cards/CardCreationModal', () => ({
  default: () => <div data-testid="card-creation-modal">Creation Modal</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('OverviewPage', () => {
  const mockUseActivityRoom = vi.mocked(useActivityRoom);

  beforeEach(() => {
    // Reset document.title before each test
    document.title = 'Trippy';
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Reset document.title after each test
    document.title = 'Trippy';
  });

  describe('Document Title Management', () => {
    it('sets title to "Loading activity" when loading', () => {
      mockUseActivityRoom.mockReturnValue({
        activity: null,
        loading: true,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: false
      });

      renderWithRouter(<OverviewPage />);

      expect(document.title).toBe('Loading activity');
    });

    it('sets title to activity name when activity has a name', () => {
      const activityWithName = {
        id: 'activity123',
        name: 'Trip to Paris',
        cards: []
      };

      mockUseActivityRoom.mockReturnValue({
        activity: activityWithName,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      renderWithRouter(<OverviewPage />);

      expect(document.title).toBe('Trip to Paris');
    });

    it('sets title to "Untitled Activity" when activity exists but has no name', () => {
      const activityWithoutName = {
        id: 'activity123',
        name: '',
        cards: []
      };

      mockUseActivityRoom.mockReturnValue({
        activity: activityWithoutName,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      renderWithRouter(<OverviewPage />);

      expect(document.title).toBe('Untitled Activity');
    });

    it('sets title to "Activity" when activity is null and not loading', () => {
      mockUseActivityRoom.mockReturnValue({
        activity: null,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: false
      });

      renderWithRouter(<OverviewPage />);

      expect(document.title).toBe('Activity');
    });

    it('updates title when activity name changes', () => {
      const activityV1 = {
        id: 'activity123',
        name: 'Original Name',
        cards: []
      };

      const activityV2 = {
        id: 'activity123',
        name: 'Updated Name',
        cards: []
      };

      // Initial render with first activity name
      mockUseActivityRoom.mockReturnValue({
        activity: activityV1,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      const { rerender } = renderWithRouter(<OverviewPage />);
      expect(document.title).toBe('Original Name');

      // Re-render with updated activity name
      mockUseActivityRoom.mockReturnValue({
        activity: activityV2,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      rerender(
        <BrowserRouter>
          <OverviewPage />
        </BrowserRouter>
      );

      expect(document.title).toBe('Updated Name');
    });

    it('resets title to "Trippy" when component unmounts', () => {
      const activity = {
        id: 'activity123',
        name: 'Trip to Paris',
        cards: []
      };

      mockUseActivityRoom.mockReturnValue({
        activity,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      const { unmount } = renderWithRouter(<OverviewPage />);

      expect(document.title).toBe('Trip to Paris');

      unmount();

      expect(document.title).toBe('Trippy');
    });
  });

  describe('Component Rendering', () => {
    it('shows loading card when loading', () => {
      mockUseActivityRoom.mockReturnValue({
        activity: null,
        loading: true,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: false
      });

      renderWithRouter(<OverviewPage />);

      expect(screen.getByTestId('loading-card')).toBeInTheDocument();
    });

    it('shows error when activity is null and not loading', () => {
      mockUseActivityRoom.mockReturnValue({
        activity: null,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: false
      });

      renderWithRouter(<OverviewPage />);

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('renders activity content when activity is loaded', () => {
      const activity = {
        id: 'activity123',
        name: 'Trip to Paris',
        cards: []
      };

      mockUseActivityRoom.mockReturnValue({
        activity,
        loading: false,
        updateName: vi.fn(),
        updateDates: vi.fn(),
        createCard: vi.fn(),
        updateCard: vi.fn(),
        deleteCard: vi.fn(),
        isConnected: true
      });

      renderWithRouter(<OverviewPage />);

      expect(screen.getByTestId('activity-header')).toBeInTheDocument();
      expect(screen.getByTestId('cards-list')).toBeInTheDocument();
    });
  });
});