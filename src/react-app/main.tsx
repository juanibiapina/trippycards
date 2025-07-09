import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import "./main.css";
import App from "./App.tsx";
import Home from "./Home.tsx";
import TripPage from "./components/TripPage.tsx";
import CardEditPage from "./components/CardEditPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "trips/:tripId", element: <TripPage /> },
      { path: "trips/:tripId/cards/:cardId/edit", element: <CardEditPage /> },
      { path: "trips/:tripId/cards/new", element: <CardEditPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

