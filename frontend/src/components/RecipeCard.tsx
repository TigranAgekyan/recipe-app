import { Link } from "react-router";
import type { RecipeSummary } from "../api";
import { sourceIcon, sourceName } from "../lib/source";
import { displayUrl } from "../lib/youtube";
import { FavouriteButton } from "./FavouriteButton";
import { Icon } from "./Icon";
import { MetaChips } from "./MetaChips";
import { Thumbnail } from "./Thumbnail";
import "./RecipeCard.css";

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const source = sourceName(recipe.source_url);
  const icon = sourceIcon(recipe.source_url);
  return (
    <div className="recipe-card-frame">
      <Link to={`/recipes/${recipe.id}`} className="recipe-card card">
        <Thumbnail sourceUrl={recipe.source_url}>
          {source && (
            <span className="recipe-card__badge label-caps">
              {icon ? <img className="recipe-card__badge-logo" src={icon} alt="" /> : <Icon name="article" fill />}
              {source}
            </span>
          )}
        </Thumbnail>
        <div className="recipe-card__body">
          <h2 className="recipe-card__title">{recipe.title}</h2>
          {recipe.source_url && <p className="recipe-card__url">{displayUrl(recipe.source_url)}</p>}
          <MetaChips totalTimeMinutes={recipe.total_time_minutes} servings={recipe.servings} />
        </div>
      </Link>
      {/* Beside the link rather than inside it, since a button can't nest in a link */}
      <FavouriteButton recipe={recipe} className="recipe-card__favourite" />
    </div>
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
