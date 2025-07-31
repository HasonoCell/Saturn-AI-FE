import { Outlet } from "react-router";
import { Permission } from "../../Common";

const AILayout = () => {
  return (
    <Permission>
      <Outlet />
    </Permission>
  );
};

export default AILayout;
