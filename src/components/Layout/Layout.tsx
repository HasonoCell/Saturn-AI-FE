import { Outlet } from "react-router";
import { Permission } from "../index";

const Layout = () => {
  return (
    <Permission>
      <Outlet />
    </Permission>
  );
};

export default Layout;
