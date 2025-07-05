import { Session } from '@auth/core/types';
import { signOut } from '@hono/auth-js/react';

// takes session as a prop
const Home = ({ session }: { session: Session }) => {
  return (
    <div>
      <h1>Hey Lovely Girl ❤️</h1>

      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default Home;
