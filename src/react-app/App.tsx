// src/App.tsx

import { useSession, signIn, signOut } from '@hono/auth-js/react';
import TripCard from "./components/TripCard";
import "./App.css";

function App() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('google')}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signOut()}>
        Sign Out
      </button>

      <TripCard />
    </div>
  );
}

export default App;
