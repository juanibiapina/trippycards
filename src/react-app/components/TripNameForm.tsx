import { useState } from "react";
import { useParams } from "react-router";
import Card from "./Card";

const TripNameForm = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [tripName, setTripName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tripName.trim()) {
      setError("Please enter a trip name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/v2/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tripName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to save trip name");
      }

      // Reload the page to show the updated trip
      window.location.reload();
    } catch (error) {
      console.error("Error saving trip name:", error);
      setError("Failed to save trip name. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Name Your Trip</h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter trip name..."
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {loading ? "Saving..." : "Let's Go!"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TripNameForm;
