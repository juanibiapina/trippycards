// src/App.tsx

import { SessionProvider, useSession, signIn, signOut } from '@hono/auth-js/react';
import TripCard from "./components/TripCard";
import "./App.css";

function AppContent() {
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
      <TripCard />
    </div>
  );
}

function App() {
  return (
    <SessionProvider basePath="/api/auth">
        <button onClick={() => signOut()}>
          Sign Out
        </button>
      <AppContent />
    </SessionProvider>
  );
}

export default App;
