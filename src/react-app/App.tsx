// src/App.tsx

import TripCard from "./components/TripCard";
import { AuthButton } from "./components/AuthButton";
import "./App.css";

function App() {
  return (
    <div>
      <header className="p-4 border-b">
        <AuthButton />
      </header>
      <main className="p-4">
        <TripCard />
      </main>
    </div>
  );
}

export default App;
