import type { Recipe } from "../api";
import { isVideoSource, sourceName } from "../lib/source";
import { FavouriteButton } from "./FavouriteButton";
import { Icon } from "./Icon";
import { MetaChips } from "./MetaChips";
import { Thumbnail } from "./Thumbnail";
import "./RecipeHero.css";

export function RecipeHero({ recipe }: { recipe: Recipe }) {
  const source = sourceName(recipe.source_url);
  return (
    <header className="hero">
      <Thumbnail sourceUrl={recipe.source_url} className="hero__media">
        {recipe.source_url && (
          <a className="hero__watch" href={recipe.source_url} target="_blank" rel="noreferrer">
            <span className="hero__watch-dot" />
            {source ? `${isVideoSource(recipe.source_url) ? "Watch" : "Read"} on ${source}` : "Open source"}
            <Icon name="open_in_new" />
          </a>
        )}
        <FavouriteButton recipe={recipe} className="hero__favourite" />
        <div className="hero__chips">
          <MetaChips totalTimeMinutes={recipe.total_time_minutes} servings={recipe.servings} variant="overlay" />
        </div>
      </Thumbnail>
      <h1 className="hero__title">{recipe.title}</h1>
    </header>
  );
}

export function RecipeHeroSkeleton() {
  return (
    <div className="hero" aria-hidden="true">
      <div className="thumb hero__media skeleton" />
      <div className="skeleton" style={{ height: 32, width: "85%" }} />
      <div className="skeleton" style={{ height: 32, width: "55%" }} />
    </div>
  );
}
