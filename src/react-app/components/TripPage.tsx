import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingCard from "./LoadingCard";
import TripNameForm from "./TripNameForm";
import Card from "./Card";
import Button from "./Button";

interface CardData {
  id: string;
  title: string;
}

interface Trip {
  name?: string;
  cards?: CardData[];
}

const TripPage = () => {
  const params = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTrip = useCallback(() => {
    fetch(`/api/trips/v2/${params.tripId}`)
      .then((res) => res.json() as Promise<Trip>)
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip:", error);
        setLoading(false);
      });
  }, [params.tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleNewCard = () => {
    navigate(`/trips/${params.tripId}/cards/new`);
  };

  const handleEditCard = (cardId: string) => {
    navigate(`/trips/${params.tripId}/cards/${cardId}`);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/v2/${params.tripId}/cards/${cardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      // Refresh the trip data
      loadTrip();
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card. Please try again.");
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">We couldn't load your trip. Please try again.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!trip.name) {
    return <TripNameForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{trip.name}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* New Card Button */}
          <div className="mb-8">
            <div className="max-w-md">
              <Button onClick={handleNewCard}>
                + New Card
              </Button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trip.cards && trip.cards.length > 0 ? (
              trip.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleEditCard(card.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete card"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to edit
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
                <p className="text-gray-500 mb-4">Start building your trip by adding your first card</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPage;
