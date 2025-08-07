import type React from "react";
import type { ProtectedRouteProps } from "./types";
import { useUserStore } from "../../../stores";
import { useLocation, Navigate } from "react-router";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
