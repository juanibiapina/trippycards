import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router";

import "./main.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import ActivityPage from "./pages/ActivityPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import QuestionsPage from "./pages/QuestionsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "activities/:activityId",
        element: <ActivityPage />,
        children: [
          { index: true, element: <Navigate to="questions" replace /> },
          { path: "overview", element: <OverviewPage /> },
          { path: "questions", element: <QuestionsPage /> },
        ]
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

