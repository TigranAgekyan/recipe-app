import { useState } from "react";
import type { RecipeSummary } from "../api";
import { useRecipes } from "../state/recipes";
import { Icon } from "./Icon";
import "./FavouriteButton.css";

type Props = {
  recipe: RecipeSummary;
  className?: string;
};

/** Heart toggle for use over a thumbnail. The cached list is the source of truth once loaded. */
export function FavouriteButton({ recipe, className }: Props) {
  const { recipes, setFavourite } = useRecipes();
  const [saving, setSaving] = useState(false);
  const on = recipes?.find((r) => r.id === recipe.id)?.is_favourite ?? recipe.is_favourite;

  const toggle = async () => {
    if (saving) return;
    setSaving(true);
    await setFavourite(recipe.id, !on);
    setSaving(false);
  };

  return (
    <button
      className={["favourite-btn", on && "favourite-btn--on", className].filter(Boolean).join(" ")}
      onClick={toggle}
      disabled={!recipes}
      aria-pressed={on}
      aria-label={`Favourite ${recipe.title}`}
    >
      <Icon name="favorite" fill={on} />
    </button>
  );
}
