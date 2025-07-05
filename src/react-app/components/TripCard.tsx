import { useState, useEffect } from "react";
import styles from "./TripCard.module.css";
import AttendanceCard from "./AttendanceCard";
import { useSession } from "../../lib/auth-client";

interface Trip {
  name: string;
}

const TripCard = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

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

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Welcome to Travel Cards</h1>
          <p>Please sign in to view your trips and manage your travel cards.</p>
        </div>
      </div>
    );
  }

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
        <p>Welcome back, {session.user.name}!</p>
      </header>
      <AttendanceCard />
    </div>
  );
};

export default TripCard;