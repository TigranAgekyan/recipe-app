import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { EmptyCookbook } from "../components/EmptyCookbook";
import { GooeySearch } from "../components/GooeySearch";
import { Icon } from "../components/Icon";
import { ImportJobCard } from "../components/ImportJobCard";
import { RecipeCard, RecipeCardSkeleton } from "../components/RecipeCard";
import { StatusMessage } from "../components/StatusMessage";
import { useStoredState } from "../lib/storage";
import { useImports } from "../state/imports";
import { useRecipes } from "../state/recipes";
import "./RecipeListPage.css";

export function RecipeListPage() {
  const { recipes, error, reload } = useRecipes();
  const { jobs } = useImports();
  const [search, setSearch] = useState("");
  // Session storage: the filter survives opening a recipe and coming back
  const [favouritesOnly, setFavouritesOnly] = useStoredState("simmer:favourites-only", false, sessionStorage);

  const hasRecipes = !!recipes && recipes.length > 0;
  const query = search.trim().toLowerCase();
  const matches =
    recipes?.filter((recipe) => recipe.title.toLowerCase().includes(query) && (!favouritesOnly || recipe.is_favourite)) ?? [];

  let content;
  if (error && !recipes) {
    content = (
      <StatusMessage
        icon="cloud_off"
        title="Couldn't load your cookbook"
        action={
          <button className="btn btn--primary" onClick={reload}>
            <Icon name="refresh" />
            Try again
          </button>
        }
      >
        {error}
      </StatusMessage>
    );
  } else if (!recipes) {
    content = (
      <div className="list-page__grid">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
    );
  } else if (recipes.length === 0) {
    content = <EmptyCookbook />;
  } else if (matches.length === 0 && query) {
    content = (
      <StatusMessage icon="search" title="No matching recipes">
        Nothing in your {favouritesOnly ? "favourites" : "cookbook"} matches “{search.trim()}”.
      </StatusMessage>
    );
  } else if (matches.length === 0) {
    content = (
      <StatusMessage icon="favorite" title="No favourites yet">
        Tap the heart on a recipe to keep it here.
      </StatusMessage>
    );
  } else {
    content = (
      <div className="list-page__grid">
        {matches.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    );
  }

  return (
    <>
      <AppHeader actions={hasRecipes && <GooeySearch value={search} onChange={setSearch} />} />
      <main className="page list-page">
        {hasRecipes && (
          <div className="list-page__head">
            <div className="list-page__intro">
              <h1 className="headline-lg">Your Kitchen Journal</h1>
              <p className="label-caps muted">
                {(query || favouritesOnly) && `${matches.length} of `}
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
              </p>
            </div>
            <button
              className={`chip-btn list-page__filter${favouritesOnly ? " list-page__filter--on" : ""}`}
              onClick={() => setFavouritesOnly((on) => !on)}
              aria-pressed={favouritesOnly}
            >
              <Icon name="favorite" fill={favouritesOnly} />
              Favourites
            </button>
          </div>
        )}

        {jobs.length > 0 && (
          <section className="list-page__jobs" aria-label="Imports">
            {jobs.map((job) => (
              <ImportJobCard key={job.id} job={job} />
            ))}
          </section>
        )}

        {content}
      </main>
    </>
  );
}
