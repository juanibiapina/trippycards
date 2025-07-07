import { SessionProvider } from '@hono/auth-js/react';
import { Outlet } from "react-router";

function App() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
}

export default App;
