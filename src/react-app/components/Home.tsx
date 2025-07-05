import { Session } from '@auth/core/types';
import { signOut } from '@hono/auth-js/react';

const Home = ({ session }: { session: Session }) => {
  return (
    <div>
      <h1>Hey Lovely Girl ❤️</h1>

      {session.user?.image && (
        <div>
          <img
            src={session.user.image}
            alt="Profile"
          />
        </div>
      )}

      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

export default Home;
