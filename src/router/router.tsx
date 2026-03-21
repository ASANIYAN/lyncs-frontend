import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "../App";
import Signup from "@/modules/auth/views/signup";
import Login from "@/modules/auth/views/login";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import UrlsView from "@/modules/urls/views/urls-view";
import AnalyticsView from "@/modules/analytics/views/analytics-view";
import ProfileView from "@/modules/profile/views/profile-view";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <UrlsView />,
      },
      {
        path: "analytics/:shortCode",
        element: <AnalyticsView />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
    ],
  },
];

// Unprotected routes
const unprotectedRoutes: RouteObject[] = [
  {
    index: true,
    element: <Signup />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

// Main router configuration
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />, // App component acts as the root boundary
    errorElement: <></>, // A global error element
    children: [...unprotectedRoutes, ...dashboardRoutes],
  },
];

// Create the router instance
const router = createBrowserRouter(routes);

export default router;
