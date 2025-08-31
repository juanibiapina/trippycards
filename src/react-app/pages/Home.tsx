import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';

import Button from '../components/Button.tsx';
import Box from '../components/Box.tsx';
import LoadingCard from '../components/LoadingCard.tsx';

function Home() {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();

  const createActivity = () => {
    const activityId = crypto.randomUUID();
    navigate(`/activities/${activityId}`);
  };

  if (!isLoaded) {
    return <LoadingCard />;
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Box>
            <div className="text-center">
              <div className="mb-4">
                <UserButton />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Hi {user?.firstName}</h1>

              <div className="space-y-4">
                <Button onClick={() => createActivity()}>
                  New Activity
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </SignedIn>
    </>
  )
}

export default Home;
