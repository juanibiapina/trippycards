import { useSession, signIn } from '@hono/auth-js/react';
import { signOut } from '@hono/auth-js/react';
import { useEffect } from 'react';

import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import { useNavigate, useSearchParams } from 'react-router';

function Home() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if there's a redirect URL after successful authentication
  useEffect(() => {
    if (session) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        // Clear the redirect parameter and navigate to the intended URL
        navigate(decodeURIComponent(redirectUrl), { replace: true });
      }
    }
  }, [session, searchParams, navigate]);

  if (!session) {
    const redirectUrl = searchParams.get('redirect');
    const callbackUrl = redirectUrl
      ? `${window.location.origin}/?redirect=${redirectUrl}`
      : window.location.origin;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Trippy</h1>
            <Button onClick={() => signIn('google', { callbackUrl })}>
              Sign In with Google
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const createActivity = () => {
    const activityId = crypto.randomUUID();
    navigate(`/activities/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Hi {session.user?.name}!</h1>

          <div className="space-y-4">
            <Button onClick={() => createActivity()}>
              New Activity
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
