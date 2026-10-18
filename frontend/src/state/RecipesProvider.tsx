import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type RecipeSummary } from "../api";
import { useImports } from "./imports";
import { RecipesContext } from "./recipes";

// Lives in the layout so the list is cached across navigation: going back
// from a recipe shows it instantly and scroll restoration has content to land on.
export function RecipesProvider({ children }: { children: ReactNode }) {
  const { recipesVersion } = useImports();
  const [recipes, setRecipes] = useState<RecipeSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    api.listRecipes().then(
      (list) => {
        if (!current) return;
        setRecipes(list);
        setError(null);
      },
      (err: Error) => current && setError(err.message),
    );
    return () => {
      current = false;
    };
  }, [recipesVersion, attempt]);

  const reload = useCallback(() => {
    setError(null);
    setAttempt((a) => a + 1);
  }, []);

  const value = useMemo(() => ({ recipes, error, reload }), [recipes, error, reload]);
  return <RecipesContext value={value}>{children}</RecipesContext>;
}
