import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import { RouterProvider } from "react-router";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
