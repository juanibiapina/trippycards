import { useState } from "react";
import styles from "./AttendanceCard.module.css";

type AttendanceStatus = "yes" | "maybe" | "no" | null;

const AttendanceCard = () => {
  const [attendance, setAttendance] = useState<AttendanceStatus>(null);

  const handleAttendanceClick = (status: AttendanceStatus) => {
    setAttendance(status);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>Are you going?</h2>
      <p className={styles.subtitle}>
        Please confirm your attendance for the Red Rock climbing trip
      </p>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.yesButton} ${
            attendance === "yes" ? styles.selected : ""
          }`}
          onClick={() => handleAttendanceClick("yes")}
        >
          <span className={styles.icon}>✓</span>
          <span className={styles.label}>Yes</span>
        </button>

        <button
          className={`${styles.button} ${styles.maybeButton} ${
            attendance === "maybe" ? styles.selected : ""
          }`}
          onClick={() => handleAttendanceClick("maybe")}
        >
          <span className={styles.icon}>⏰</span>
          <span className={styles.label}>Maybe</span>
        </button>

        <button
          className={`${styles.button} ${styles.noButton} ${
            attendance === "no" ? styles.selected : ""
          }`}
          onClick={() => handleAttendanceClick("no")}
        >
          <span className={styles.icon}>✕</span>
          <span className={styles.label}>No</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceCard;
