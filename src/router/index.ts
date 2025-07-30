import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorBoundary from "../components/Common/ErrorBoundary/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "*",
    Component: ErrorBoundary,
  },
]);

export default router;
