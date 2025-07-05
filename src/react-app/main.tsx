import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SessionProvider } from '@hono/auth-js/react';
import { BrowserRouter, Routes, Route } from "react-router";

import "./main.css";
import Home from "./Home.tsx";
import TripCard from "./components/TripCard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/trips/:tripId" element={<TripCard />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>,
);
