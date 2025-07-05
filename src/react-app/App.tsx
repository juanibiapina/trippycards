// src/App.tsx

import { SessionProvider, useSession, signIn, signOut } from '@hono/auth-js/react';
import TripCard from "./components/TripCard";
import "./App.css";

function AppContent() {
  const { data: session } = useSession();

  // Allow bypassing authentication in test environment
  const isTestMode = new URLSearchParams(window.location.search).has('test');

  if (!session && !isTestMode) {
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
    <SessionProvider>
        <button onClick={() => signOut()}>
          Sign Out
        </button>
      <AppContent />
    </SessionProvider>
  );
}

export default App;
