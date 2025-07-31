import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home, Login, Register } from "../pages";
import { AILayout, AuthTransition, ErrorBoundary } from "../components";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        Component: AuthTransition,
        children: [
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: Register,
          },
        ],
      },
      {
        Component: AILayout,
        children: [
          {
            path: "home",
            Component: Home,
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
