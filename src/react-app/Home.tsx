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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Cards</h1>
            <p className="text-gray-600 mb-8">Plan and organize your trips with ease</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Ready to plan your next adventure?</p>

          <div className="space-y-4">
            <Button onClick={() => createTrip()}>
              Create New Trip
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
