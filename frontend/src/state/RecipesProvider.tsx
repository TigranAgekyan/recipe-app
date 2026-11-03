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

  // Updates the list right away, and puts it back if the server refuses
  const setFavourite = useCallback(async (id: number, favourite: boolean) => {
    const apply = (value: boolean) =>
      setRecipes((list) => list && list.map((r) => (r.id === id ? { ...r, is_favourite: value } : r)));
    apply(favourite);
    try {
      await api.setFavourite(id, favourite);
    } catch {
      apply(!favourite);
    }
  }, []);

  const value = useMemo(() => ({ recipes, error, reload, setFavourite }), [recipes, error, reload, setFavourite]);
  return <RecipesContext value={value}>{children}</RecipesContext>;
}
