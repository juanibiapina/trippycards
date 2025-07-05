import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface Trip {
  name?: string;
}

const TripCard = () => {
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
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto">
        <div>Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto">
        <div>Failed to load trip</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <header>
        <h1>{trip.name}</h1>
      </header>
    </div>
  );
};

export default TripCard;
