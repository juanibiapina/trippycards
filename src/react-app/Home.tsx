// src/App.tsx

import { useSession, signIn } from '@hono/auth-js/react';
import { signOut } from '@hono/auth-js/react';

import Button from './components/Button.tsx';
import { useNavigate } from 'react-router';

function Home() {
  const { data: session } = useSession();
  const navigate = useNavigate();

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
    const tripId = crypto.randomUUID();
    navigate(`/trips/${tripId}`);
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
