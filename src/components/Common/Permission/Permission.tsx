import type React from "react";
import type { PermissionProps } from "./types";
import { useUserStore } from "../../../stores";
import { useLocation, Navigate } from "react-router";

const Permission: React.FC<PermissionProps> = ({
  children,
  redirectPath = "/login",
  saveLocation = false,
}) => {
  const { isAuthenticated } = useUserStore.getState();
  const location = useLocation();

  if (import.meta.env.DEV) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={saveLocation ? { from: location.pathname } : undefined}
      />
    );
  }

  return <>{children}</>;
};

export default Permission;
