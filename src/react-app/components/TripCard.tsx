import { useState, useEffect } from "react";
import styles from "./TripCard.module.css";

interface Trip {
  name: string;
}

const TripCard = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trips/v2/1")
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
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!trip) {
    return <div className={styles.error}>Failed to load trip</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.tripName}>{trip.name}</h1>
      </header>
    </div>
  );
};

export default TripCard;
