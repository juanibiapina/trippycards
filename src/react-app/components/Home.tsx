import { Session } from '@auth/core/types';
import { signOut } from '@hono/auth-js/react';

import './Home.css';

const Home = ({ session }: { session: Session }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">Hey Lovely Girl ❤️</h1>

      {session.user?.image && (
        <div className="profile-image-block">
          <img
            src={session.user.image}
            alt="Profile"
            className="profile-image"
          />
        </div>
      )}

      <button className="signout-button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

export default Home;
