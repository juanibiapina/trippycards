import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import "./main.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import ActivityPage from "./pages/ActivityPage.tsx";
import CardDetailPage from "./pages/CardDetailPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "activities/:activityId", element: <ActivityPage /> },
      { path: "activities/:activityId/cards/:cardId", element: <CardDetailPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

