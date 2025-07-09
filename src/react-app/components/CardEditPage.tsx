import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingCard from "./LoadingCard";
import Card from "./Card";
import Button from "./Button";

interface CardData {
  id: string;
  title: string;
}

const CardEditPage = () => {
  const params = useParams<{ tripId: string; cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardData | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = params.cardId === "new";

  useEffect(() => {
    if (isNew) {
      // For new cards, generate a UUID and initialize with empty title
      const newCard: CardData = {
        id: crypto.randomUUID(),
        title: "",
      };
      setCard(newCard);
      setTitle("");
      setLoading(false);
    } else {
      // For existing cards, fetch the card data
      fetch(`/api/trips/v2/${params.tripId}/cards/${params.cardId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Card not found");
          }
          return res.json() as Promise<CardData>;
        })
        .then((data) => {
          setCard(data);
          setTitle(data.title);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching card:", error);
          setError("Card not found");
          setLoading(false);
        });
    }
  }, [params.tripId, params.cardId, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isNew) {
        // Create new card
        const response = await fetch(`/api/trips/v2/${params.tripId}/cards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: card!.id,
            title: title.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create card");
        }
      } else {
        // Update existing card
        const response = await fetch(`/api/trips/v2/${params.tripId}/cards/${params.cardId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update card");
        }
      }

      // Navigate back to trip page
      navigate(`/trips/${params.tripId}`);
    } catch (error) {
      console.error("Error saving card:", error);
      setError("Failed to save card. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/trips/${params.tripId}`);
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (error && !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Card Not Found</h2>
            <p className="text-gray-600 mb-4">The card you're looking for doesn't exist.</p>
            <Button onClick={handleCancel}>Back to Trip</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isNew ? "New Card" : "Edit Card"}
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter card title"
                disabled={saving}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CardEditPage;