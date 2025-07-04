import { useSession, signIn, signOut } from "../auth-client";
import styles from "./AuthComponent.module.css";

const AuthComponent = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    return (
      <div className={styles.authContainer}>
        <h2>Welcome to Travel Cards</h2>
        <p>Please sign in to continue</p>
        <button
          className={styles.signInButton}
          onClick={() => signIn.social({ provider: "google" })}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className={styles.userContainer}>
      <div className={styles.userInfo}>
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className={styles.userAvatar}
          />
        )}
        <div className={styles.userDetails}>
          <h3>Welcome, {session.user.name}!</h3>
          <p>{session.user.email}</p>
        </div>
      </div>
      <button
        className={styles.signOutButton}
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

export default AuthComponent;