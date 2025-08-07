import { Outlet, useNavigate } from "react-router";
import { useUserStore } from "./stores";
import { useEffect } from "react";

const App = () => {
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};
export default App;
