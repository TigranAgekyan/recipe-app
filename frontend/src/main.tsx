import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// Global styles first so component CSS can override them
import "./index.css";
import { Layout } from "./components/Layout";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeListPage } from "./pages/RecipeListPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RecipeListPage },
      { path: "recipes/:id", Component: RecipeDetailPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
