import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

import LoadingCard from "../components/LoadingCard";
import CardComponent from "../components/Card";
import ActivityHeader from "../components/ActivityHeader";
import CardDateSelector from "../components/CardDateSelector";
import FloatingCardInput from "../components/FloatingCardInput";
import CardCreationModal from "../components/cards/CardCreationModal";
import SubCard from "../components/cards/SubCard";
import { useActivityRoomContext } from "../hooks/useActivityRoomContext";
import { useLongPress } from "../hooks/useLongPress";
import { Card as CardType, LinkCard, PollCard, NoteCard, LinkCardInput, PollCardInput, NoteCardInput, AILinkCardInput } from "../../shared";
import LinkCardComponent from "../components/cards/LinkCard";
import PollCardComponent from "../components/cards/PollCard";
import NoteCardComponent from "../components/cards/NoteCard";

const CardDetailPage = () => {
  const params = useParams<{ activityId: string; cardId: string }>();
  const navigate = useNavigate();
  const { isLoaded, userId } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { activity, loading, updateName, updateDates, updateCard, deleteCard, isConnected } = useActivityRoomContext();

  const card = activity?.cards?.find(c => c.id === params.cardId);

  const handleDeleteCard = () => {
    if (!isConnected || !card) return;
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(card.id);
      navigate(`/activities/${params.activityId}`);
    }
  };

  const handleDeleteSubcard = (subcardId: string) => {
    if (!isConnected || !card) return;
    if (confirm('Are you sure you want to delete this subcard?')) {
      const updatedCard: CardType = {
        ...card,
        children: card.children?.filter(c => c.id !== subcardId) || [],
        updatedAt: new Date().toISOString(),
      };
      updateCard(updatedCard);
    }
  };

  // Initialize hooks before any conditional returns
  const mainCardLongPress = useLongPress(handleDeleteCard);

  // Update document title
  useEffect(() => {
    if (loading) {
      document.title = 'Loading card';
    } else if (card) {
      let cardTitle = 'Card';
      if (card.type === 'link') {
        cardTitle = (card as LinkCard).title || (card as LinkCard).url;
      } else if (card.type === 'poll') {
        cardTitle = (card as PollCard).question;
      } else if (card.type === 'note') {
        cardTitle = (card as NoteCard).text.substring(0, 50) + '...';
      }
      document.title = `${cardTitle} - ${activity?.name || 'Activity'}`;
    } else {
      document.title = 'Card not found';
    }

    return () => {
      document.title = 'Trippy';
    };
  }, [card, activity?.name, loading]);

  const handleNameUpdate = (name: string) => {
    if (isConnected) {
      updateName(name);
    }
  };

  const handleDateChange = (startDate: string, endDate?: string, startTime?: string) => {
    if (!isConnected) return;
    updateDates(startDate, endDate, startTime);
  };

  const handleCardDateChange = (date?: string) => {
    if (!isConnected || !card) return;
    const updatedCard: CardType = {
      ...card,
      date,
      updatedAt: new Date().toISOString(),
    };
    updateCard(updatedCard);
  };

  const handleCreateSubcard = (cardData: LinkCardInput | PollCardInput | NoteCardInput | AILinkCardInput) => {
    if (!isConnected || !card) return;

    const base = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newSubcard: CardType;
    if (cardData.type === 'link') {
      newSubcard = { ...cardData, ...base };
    } else if (cardData.type === 'poll') {
      newSubcard = { ...cardData, ...base };
    } else if (cardData.type === 'note') {
      newSubcard = { ...cardData, ...base };
    } else if (cardData.type === 'ailink') {
      newSubcard = { ...cardData, ...base, status: 'processing' } as CardType;
    } else {
      return;
    }

    // Add subcard to parent card's children
    const updatedCard: CardType = {
      ...card,
      children: [...(card.children || []), newSubcard],
      updatedAt: new Date().toISOString(),
    };
    updateCard(updatedCard);
  };

  const handleCreateNoteSubcard = (text: string) => {
    if (!isConnected || !card) return;

    const cardData: NoteCardInput = {
      type: 'note',
      text,
    };

    handleCreateSubcard(cardData);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleBack = () => {
    navigate(`/activities/${params.activityId}`);
  };

  // Show loading while authentication status is being determined
  if (!isLoaded) {
    return <LoadingCard />;
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return <LoadingCard />;
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <CardComponent>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Activity not found</h2>
            <p className="text-gray-600">Please check the URL and try again.</p>
          </div>
        </CardComponent>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <CardComponent>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Card not found</h2>
            <p className="text-gray-600">This card may have been deleted.</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Activity
            </button>
          </div>
        </CardComponent>
      </div>
    );
  }

  const renderCard = () => {
    switch (card.type) {
      case 'link':
        return <LinkCardComponent card={card as LinkCard} />;
      case 'poll':
        return (
          <PollCardComponent
            card={card as PollCard}
            userId={userId}
            onVote={(optionIdx: number) => {
              const pollCard = card as PollCard;
              const votes = pollCard.votes ? [...pollCard.votes] : [];
              const existing = votes.findIndex(v => v.userId === userId);
              if (existing !== -1) {
                votes[existing] = { userId, option: optionIdx };
              } else {
                votes.push({ userId, option: optionIdx });
              }
              updateCard({ ...pollCard, votes } as CardType);
            }}
          />
        );
      case 'note':
        return <NoteCardComponent card={card as NoteCard} />;
      default:
        return (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-600">Unknown card type: {card.type}</p>
          </div>
        );
    }
  };

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
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        {/* Card Content */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-auto"
          {...mainCardLongPress}
        >
          {renderCard()}
        </div>

        {/* Card Date Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto mt-6">
          <CardDateSelector
            cardDate={card.date}
            onDateChange={handleCardDateChange}
            disabled={!isConnected}
          />
        </div>

        {/* Subcards */}
        {card.children && card.children.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Subcards</h3>
            <div className="space-y-4 ml-6">
              {card.children.map((subcard) => (
                <SubCard
                  key={subcard.id}
                  subcard={subcard}
                  userId={userId}
                  onDeleteSubcard={handleDeleteSubcard}
                  onUpdateCard={updateCard}
                  parentCard={card}
                />
              ))}
            </div>
          </div>
        )}

        <CardCreationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreateSubcard}
          editingCard={undefined}
        />
      </div>

      {/* Floating Card Input for Subcards */}
      <FloatingCardInput
        onCreateCard={handleCreateNoteSubcard}
        onOpenModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
};

export default CardDetailPage;