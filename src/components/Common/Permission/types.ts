import type React from "react";

export interface PermissionProps {
  children: React.ReactNode;
  redirectPath?: string;
  saveLocation?: boolean;
}
