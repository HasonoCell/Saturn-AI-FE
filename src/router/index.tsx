import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import { Home, Conversation, Login, Register } from "../pages";
import {
  AILayout,
  AuthTransition,
  ErrorBoundary,
  ProtectedRoute,
  PublicRoute,
} from "../components";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        Component: AuthTransition,
        children: [
          {
            path: "login",
            element: (
              <PublicRoute>
                <Login />
              </PublicRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoute>
                <Register />
              </PublicRoute>
            ),
          },
        ],
      },
      {
        element: (
          <ProtectedRoute>
            <AILayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "home",
            Component: Home,
          },
          {
            path: "conversation/:id",
            Component: Conversation,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: ErrorBoundary,
  },
]);

export default router;
