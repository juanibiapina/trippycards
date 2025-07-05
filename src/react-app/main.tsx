import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SessionProvider } from '@hono/auth-js/react';
import { BrowserRouter, Routes, Route } from "react-router";

import "./main.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>,
);
