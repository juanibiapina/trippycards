import { useState } from "react";
import { useParams } from "react-router";
import Card from "./Card";

const TripNameForm = () => {
  const params = useParams<{ tripId: string }>();
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
      const response = await fetch(`/api/trips/v2/${params.tripId}`, {
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
            <div className="text-blue-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Name Your Trip</h2>
            <p className="text-gray-600">Give your trip a memorable name</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-2">
                Trip Name
              </label>
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
              {loading ? "Saving..." : "Save Trip Name"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TripNameForm;