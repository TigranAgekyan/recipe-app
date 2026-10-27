import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// Global styles first so component CSS can override them
import "./index.css";
import { Layout } from "./components/Layout";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeListPage } from "./pages/RecipeListPage";

// basename = Vite's base path: "/" normally, "/simmer-demo/" in the demo build
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RecipeListPage },
      { path: "recipes/:id", Component: RecipeDetailPage },
    ],
  },
], { basename: import.meta.env.BASE_URL });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
