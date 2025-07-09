import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingCard from "./LoadingCard";
import TripNameForm from "./TripNameForm";
import Card from "./Card";
import Button from "./Button";

interface Card {
  id: string;
  title: string;
}

interface Trip {
  name?: string;
  cards?: Card[];
}

const TripPage = () => {
  const params = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleNewCard = () => {
    navigate(`/trips/${params.tripId}/cards/new`);
  };

  const handleEditCard = (cardId: string) => {
    navigate(`/trips/${params.tripId}/cards/${cardId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{trip.name}</h1>
          <button
            onClick={handleNewCard}
            className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            New Card
          </button>
        </div>
      </header>

      {/* Cards Section */}
      <div className="px-4 py-6">
        {trip.cards && trip.cards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trip.cards.map((card) => (
              <Card key={card.id} className="cursor-pointer hover:shadow-xl transition-shadow">
                <div onClick={() => handleEditCard(card.id)}>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500">Click to edit</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-500 mb-4">Create your first card to get started!</p>
            <div className="max-w-xs mx-auto">
              <Button onClick={handleNewCard}>Create First Card</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPage;
