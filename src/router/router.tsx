import { createBrowserRouter, type RouteObject } from "react-router-dom";

import App from "../App";
import Signup from "@/modules/auth/views/signup";
import Login from "@/modules/auth/views/login";

// const protectedRoutes: RouteObject[] = [
//   {
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/dashboard",
//         element: <Dashboard />,
//       },
//     ],
//   },
// ];

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
    children: [...unprotectedRoutes],
  },
];

// Create the router instance
const router = createBrowserRouter(routes);

export default router;
