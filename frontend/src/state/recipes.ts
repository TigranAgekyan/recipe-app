import { createContext, useContext } from "react";
import type { RecipeSummary } from "../api";

export type RecipesState = {
  recipes: RecipeSummary[] | null;
  error: string | null;
  reload: () => void;
  setFavourite: (id: number, favourite: boolean) => Promise<void>;
};

export const RecipesContext = createContext<RecipesState | null>(null);

export function useRecipes(): RecipesState {
  const value = useContext(RecipesContext);
  if (!value) throw new Error("useRecipes must be used inside RecipesProvider");
  return value;
}
