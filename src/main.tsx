import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import { RouterProvider } from "react-router";
import router from "./router";
import "@ant-design/v5-patch-for-react-19";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
