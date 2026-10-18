import { Link } from "react-router";
import type { RecipeSummary } from "../api";
import { displayUrl, isShorts, youtubeId } from "../lib/youtube";
import { Icon } from "./Icon";
import { MetaChips } from "./MetaChips";
import { Thumbnail } from "./Thumbnail";
import "./RecipeCard.css";

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const isYoutube = youtubeId(recipe.source_url) !== null;
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card card">
      <Thumbnail sourceUrl={recipe.source_url}>
        {isYoutube && (
          <span className="recipe-card__badge label-caps">
            <Icon name="smart_display" fill />
            {isShorts(recipe.source_url) ? "Shorts" : "YouTube"}
          </span>
        )}
      </Thumbnail>
      <div className="recipe-card__body">
        <h2 className="recipe-card__title">{recipe.title}</h2>
        {recipe.source_url && <p className="recipe-card__url">{displayUrl(recipe.source_url)}</p>}
        <MetaChips totalTimeMinutes={recipe.total_time_minutes} servings={recipe.servings} />
      </div>
    </Link>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="recipe-card card" aria-hidden="true">
      <div className="thumb skeleton" style={{ borderRadius: 0 }} />
      <div className="recipe-card__body">
        <div className="skeleton" style={{ height: 28, width: "80%" }} />
        <div className="skeleton" style={{ height: 14, width: "55%" }} />
        <div className="skeleton" style={{ height: 30, width: 180, borderRadius: 9999 }} />
      </div>
    </div>
  );
}
