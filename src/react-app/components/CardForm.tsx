import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Card from "./Card";
import LoadingCard from "./LoadingCard";

interface CardData {
  id: string;
  title: string;
}

const CardForm = () => {
  const { tripId, cardId } = useParams<{ tripId: string; cardId: string }>();
  const navigate = useNavigate();
  const [cardTitle, setCardTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isNewCard = cardId === 'new';

  useEffect(() => {
    if (isNewCard) {
      setFetching(false);
      return;
    }

    // Fetch existing card data
    fetch(`/api/trips/v2/${tripId}/cards/${cardId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load card");
        }
        return res.json() as Promise<CardData>;
      })
      .then((card) => {
        setCardTitle(card.title);
        setFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching card:", error);
        setError("Failed to load card");
        setFetching(false);
      });
  }, [tripId, cardId, isNewCard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardTitle.trim()) {
      setError("Please enter a card title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isNewCard
        ? `/api/trips/v2/${tripId}/cards`
        : `/api/trips/v2/${tripId}/cards/${cardId}`;

      const method = isNewCard ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: cardTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to save card");
      }

      // Navigate back to trip page
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error saving card:", error);
      setError("Failed to save card. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/trips/${tripId}`);
  };

  if (fetching) {
    return <LoadingCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isNewCard ? "New Card" : "Edit Card"}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                id="cardTitle"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter card title..."
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                {loading ? "Saving..." : isNewCard ? "Create Card" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CardForm;