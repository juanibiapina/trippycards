// src/App.tsx

import { useSession } from "./auth-client";
import AuthComponent from "./components/AuthComponent";
import TripCard from "./components/TripCard";
import "./App.css";

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <AuthComponent />
      {session && <TripCard />}
    </div>
  );
}

export default App;
