import { SessionProvider } from '@hono/auth-js/react';
import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./Home.tsx";
import TripPage from "./components/TripPage.tsx";

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/trips/:tripId" element={<TripPage />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;