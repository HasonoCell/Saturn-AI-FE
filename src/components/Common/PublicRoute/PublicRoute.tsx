import type React from "react";
import type { PublicRouteProps } from "./types";
import { Navigate } from "react-router";
import { useUserStore } from "../../../stores";

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/home",
}) => {
  const { isAuthenticated } = useUserStore();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
