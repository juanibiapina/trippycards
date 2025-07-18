import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSession } from '@hono/auth-js/react';
import { FiAlertTriangle, FiPlus, FiChevronDown } from "react-icons/fi";
import LoadingCard from "../components/LoadingCard";
import Card from "../components/Card";
import ActivityHeader from "../components/ActivityHeader";
import CardCreationModal from "../components/cards/CardCreationModal";
import PollCreationModal from "../components/cards/PollCreationModal";
import CardsList from "../components/cards/CardsList";
import DeleteConfirmationDialog from "../components/cards/DeleteConfirmationDialog";
import { useActivityRoom } from "../hooks/useActivityRoom";
import { LinkCard, PollCard, Card as CardType } from "../../shared";

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isCardTypeDropdownOpen, setIsCardTypeDropdownOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardToDelete, setCardToDelete] = useState<CardType | null>(null);

  const { activity, loading, updateName, updateDates, createCard, updateCard, deleteCard, vote, isConnected } = useActivityRoom(params.activityId || '');

  const handleCreateCard = (cardData: Omit<LinkCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isConnected) return;

    const newCard: LinkCard = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createCard(newCard);
  };

  const handleCreatePoll = (cardData: Omit<PollCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isConnected) return;

    const newCard: PollCard = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createCard(newCard);
  };

  const handleUpdateCard = (card: LinkCard) => {
    if (!isConnected) return;
    updateCard(card);
  };

  const handleUpdatePoll = (card: PollCard) => {
    if (!isConnected) return;
    updateCard(card);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    if (card.type === 'poll') {
      setIsPollModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleDeleteCard = (card: CardType) => {
    setCardToDelete(card);
  };

  const handleConfirmDelete = () => {
    if (cardToDelete && isConnected) {
      deleteCard(cardToDelete.id);
      setCardToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCardToDelete(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsPollModalOpen(false);
    setEditingCard(null);
    setIsCardTypeDropdownOpen(false);
  };

  const handleVote = (cardId: string, option: string) => {
    if (!isConnected || !session?.user?.email) return;
    vote(cardId, session.user.email, option);
  };

  const handleNameUpdate = (name: string) => {
    if (isConnected) {
      updateName(name);
    }
  };

  const handleDateChange = (startDate: string, endDate?: string, startTime?: string) => {
    if (!isConnected) return;
    updateDates(startDate, endDate, startTime);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isCardTypeDropdownOpen) {
        setIsCardTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCardTypeDropdownOpen]);

  useEffect(() => {
    // Only redirect if authentication is complete and user is not authenticated
    if (status !== "loading" && !session) {
      navigate('/');
      return;
    }
  }, [session, status, navigate]);

  // Show loading while authentication status is being determined
  if (status === "loading") {
    return <LoadingCard />;
  }

  // Don't render anything if not authenticated (after loading is complete)
  if (!session) {
    return null;
  }

  if (loading) {
    return <LoadingCard />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FiAlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">We couldn't load your activity. Please try again.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityHeader
        activityName={activity?.name}
        startDate={activity?.startDate}
        endDate={activity?.endDate}
        startTime={activity?.startTime}
        onNameUpdate={handleNameUpdate}
        onDateChange={handleDateChange}
        disabled={!isConnected}
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Cards Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Cards</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              <FiPlus size={16} />
              <span>Create Card</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-2 rounded-md transition-colors shadow-md hover:shadow-lg"
                aria-label="Card type options"
              >
                <FiChevronDown size={16} />
              </button>

              {isCardTypeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(true);
                        setIsCardTypeDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Link Card
                    </button>
                    <button
                      onClick={() => {
                        setIsPollModalOpen(true);
                        setIsCardTypeDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Poll Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards List */}
        <CardsList
          cards={activity?.cards || []}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          onVote={handleVote}
          currentUserId={session?.user?.email || undefined}
        />

        <CardCreationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleUpdateCard}
          editingCard={editingCard?.type === 'link' ? editingCard as LinkCard : undefined}
        />

        <PollCreationModal
          isOpen={isPollModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreatePoll}
          onUpdateCard={handleUpdatePoll}
          editingCard={editingCard?.type === 'poll' ? editingCard as PollCard : undefined}
        />

        <DeleteConfirmationDialog
          isOpen={!!cardToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default OverviewPage;
