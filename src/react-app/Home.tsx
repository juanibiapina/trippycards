// src/App.tsx

import { useSession, signIn } from '@hono/auth-js/react';
import { signOut } from '@hono/auth-js/react';

import Button from './components/Button.tsx';

function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <Button onClick={() => signIn('google')}>
          Sign In with Google
        </Button>
      </div>
    );
  }

  const createTrip = async () => {
    // the create trip button simply needs to redirect to /api/trips/v2/<tripId>,
    // where <tripId> is a random UUID
    const tripId = crypto.randomUUID();
    window.location.href = `/api/trips/v2/${tripId}`;
  };

  return (
    <div>
      <Button onClick={() => createTrip()}>
        Create Trip
      </Button>

      <Button onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}

export default Home;
