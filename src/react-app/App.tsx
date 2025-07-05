// src/App.tsx

import TripCard from "./components/TripCard";
import AuthButton from "./components/AuthButton";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Travel Cards</h1>
      <AuthButton />
      <TripCard />
    </div>
  );
}

export default App;
