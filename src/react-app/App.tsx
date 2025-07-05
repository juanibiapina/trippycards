// src/App.tsx

import { useSession, signIn } from '@hono/auth-js/react';
import "./App.css";
import Home from "./components/Home";

function App() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('google')}>
          Sign In
        </button>
      </div>
    );
  }

  return ( <Home session={session} /> );
}

export default App;
