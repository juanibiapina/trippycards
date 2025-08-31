import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

import LoadingCard from "../components/LoadingCard";
import Box from "../components/Box";
import ActivityHeader from "../components/ActivityHeader";
import CardCreationModal from "../components/CardCreationModal";
import CardsList from "../components/CardsList";
import { useActivityRoom } from "../hooks/useActivityRoom";
import { Card } from "../../shared";

const ActivityPage = () => {
  const params = useParams<{ activityId: string }>();
  const { isLoaded, userId } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>('link');
  const { activity, loading, updateName, updateDates, createCard, updateCard, deleteCard, isConnected } = useActivityRoom(params.activityId || '');


  // Update document title based on activity state
  useEffect(() => {
    if (loading) {
      document.title = 'Loading activity';
    } else if (activity?.name) {
      document.title = `${activity.name}`;
    } else if (activity) {
      document.title = 'Untitled Activity';
    } else {
      document.title = 'Activity';
    }

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'Trippy';
    };
  }, [activity?.name, loading, activity]);

  const handleCreateCard = (cardData: Card) => {
    if (!isConnected) return;

    const newCard = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createCard(newCard);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
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
        <Box>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FiAlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">We couldn't load your activity. Please try again.</p>
          </div>
        </Box>
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
        onCreateCard={(cardType) => {
          setSelectedCardType(cardType);
          setIsCreateModalOpen(true);
        }}
        disabled={!isConnected}
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Cards List */}
        <CardsList
          cards={activity?.cards || []}
          userId={userId}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
        />

        <CardCreationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreateCard}
          cardType={selectedCardType}
        />
      </div>
    </div>
  );
};

export default ActivityPage;
