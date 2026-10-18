import { AppHeader } from "../components/AppHeader";
import { EmptyCookbook } from "../components/EmptyCookbook";
import { Icon } from "../components/Icon";
import { ImportJobCard } from "../components/ImportJobCard";
import { RecipeCard, RecipeCardSkeleton } from "../components/RecipeCard";
import { StatusMessage } from "../components/StatusMessage";
import { useImports } from "../state/imports";
import { useRecipes } from "../state/recipes";
import "./RecipeListPage.css";

export function RecipeListPage() {
  const { recipes, error, reload } = useRecipes();
  const { jobs } = useImports();

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
  } else {
    content = (
      <div className="list-page__grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="page list-page">
        {recipes && recipes.length > 0 && (
          <div className="list-page__intro">
            <h1 className="headline-lg">Your Kitchen Journal</h1>
            <p className="label-caps muted">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
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
