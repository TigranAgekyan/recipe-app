import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { api, ApiError, type Recipe } from "../api";
import { AppHeader } from "../components/AppHeader";
import { Icon } from "../components/Icon";
import { IngredientList } from "../components/IngredientList";
import { KitchenModeToggle } from "../components/KitchenModeToggle";
import { RecipeHero, RecipeHeroSkeleton } from "../components/RecipeHero";
import { StatusMessage } from "../components/StatusMessage";
import { StepList } from "../components/StepList";
import { useStoredState } from "../lib/storage";
import { useWakeLock } from "../lib/useWakeLock";
import "./RecipeDetailPage.css";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; recipe: Recipe }
  | { status: "not-found" }
  | { status: "error"; message: string };

function toggle(list: number[], index: number) {
  return list.includes(index) ? list.filter((i) => i !== index) : [...list, index];
}

function RecipeView({ recipe }: { recipe: Recipe }) {
  const location = useLocation();
  // Session storage: checks survive navigating away mid-cook, but reset next time
  const [checked, setChecked] = useStoredState<number[]>(`simmer:ingredients:${recipe.id}`, [], sessionStorage);
  const [done, setDone] = useStoredState<number[]>(`simmer:steps:${recipe.id}`, [], sessionStorage);
  const [kitchenMode, setKitchenMode] = useStoredState("simmer:kitchen-mode", false);
  useWakeLock(kitchenMode);

  // Timer pills link to #step-N
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" });
  }, [location.hash]);

  return (
    <div className={`detail${kitchenMode ? " kitchen" : ""}`}>
      <RecipeHero recipe={recipe} />
      <KitchenModeToggle on={kitchenMode} onChange={setKitchenMode} />
      <IngredientList
        ingredients={recipe.ingredients}
        checked={checked}
        onToggle={(i) => setChecked((c) => toggle(c, i))}
        onClear={() => setChecked([])}
      />
      <StepList
        recipeId={recipe.id}
        recipeTitle={recipe.title}
        steps={recipe.steps}
        done={done}
        onToggle={(i) => setDone((d) => toggle(d, i))}
      />
    </div>
  );
}

function RecipeLoader({ id }: { id: number }) {
  const valid = Number.isInteger(id) && id > 0;
  const [state, setState] = useState<LoadState>(valid ? { status: "loading" } : { status: "not-found" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!valid) return;
    let current = true;
    api.getRecipe(id).then(
      (recipe) => current && setState({ status: "ready", recipe }),
      (err: Error) => {
        if (!current) return;
        if (err instanceof ApiError && err.status === 404) setState({ status: "not-found" });
        else setState({ status: "error", message: err.message });
      },
    );
    return () => {
      current = false;
    };
  }, [id, valid, attempt]);

  switch (state.status) {
    case "loading":
      return <RecipeHeroSkeleton />;
    case "ready":
      return <RecipeView recipe={state.recipe} />;
    case "not-found":
      return (
        <StatusMessage
          icon="menu_book"
          title="Recipe not found"
          action={
            <Link to="/" className="btn btn--primary">
              Back to cookbook
            </Link>
          }
        >
          It may have been removed, or the link is wrong.
        </StatusMessage>
      );
    case "error":
      return (
        <StatusMessage
          icon="cloud_off"
          title="Couldn't load this recipe"
          action={
            <button
              className="btn btn--primary"
              onClick={() => {
                setState({ status: "loading" });
                setAttempt((a) => a + 1);
              }}
            >
              <Icon name="refresh" />
              Try again
            </button>
          }
        >
          {state.message}
        </StatusMessage>
      );
  }
}

export function RecipeDetailPage() {
  const { id } = useParams();
  return (
    <>
      <AppHeader title="Recipe" />
      <main className="page detail-page">
        {/* Keyed so per-recipe state resets when moving between recipes */}
        <RecipeLoader key={id} id={Number(id)} />
      </main>
    </>
  );
}
