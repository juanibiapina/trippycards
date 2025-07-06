import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LoadingCard from "./LoadingCard";
import TripNameForm from "./TripNameForm";
import Card from "./Card";

interface Trip {
  name?: string;
  fresh?: boolean;
  owner?: string;
}

const TripPage = () => {
  const params = useParams<{ tripId: string }>();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered className="max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{trip.name}</h1>

          <div className="space-y-4">
            <div className="text-gray-500">
              <p>Trip planning features coming soon...</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripPage;
