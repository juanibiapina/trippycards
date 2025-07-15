import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSession } from '@hono/auth-js/react';
import { FiAlertTriangle, FiPlus } from "react-icons/fi";
import LoadingCard from "../components/LoadingCard";
import Card from "../components/Card";
import ActivityHeader from "../components/ActivityHeader";
import BottomBar from "../components/BottomBar";
import CardCreationModal from "../components/cards/CardCreationModal";
import CardsList from "../components/cards/CardsList";
import { useActivityRoom } from "../hooks/useActivityRoom";
import { Card as CardType, LinkCard } from "../../shared";

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const navigate = useNavigate();
  const params = useParams<{ activityId: string }>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);

  const { activity, loading, updateName, updateDates, isConnected } = useActivityRoom(params.activityId || '');

  // Initialize cards from activity when it loads
  useEffect(() => {
    if (activity?.cards) {
      setCards(activity.cards);
    }
  }, [activity]);

  const handleCreateCard = (cardData: Omit<LinkCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: LinkCard = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);
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

      {/* Content with bottom padding to account for fixed bottom bar */}
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Cards</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              <FiPlus size={16} />
              <span>Create Card</span>
            </button>
          </div>

          <CardsList cards={cards} />
        </Card>

        <CardCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateCard={handleCreateCard}
        />
      </div>

      {/* Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
};

export default OverviewPage;