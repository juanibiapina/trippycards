// src/App.tsx

import { useSession, signIn } from '@hono/auth-js/react';
import { signOut } from '@hono/auth-js/react';

import Button from './components/Button.tsx';
import Card from './components/Card.tsx';
import { useNavigate } from 'react-router';

function Home() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card centered>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Trippy</h1>
            <Button onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const createTrip = async () => {
    const tripId = crypto.randomUUID();
    navigate(`/trips/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card centered>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Hi {session.user?.name}!</h1>

          <div className="space-y-4">
            <Button onClick={() => createTrip()}>
              New Trip
            </Button>

            <button
              onClick={() => signOut()}
              className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;
