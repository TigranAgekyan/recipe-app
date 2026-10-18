import type { Ingredient } from "../api";
import { capitalize, formatAmount } from "../lib/format";
import { Icon } from "./Icon";
import "./IngredientList.css";

type Props = {
  ingredients: Ingredient[];
  checked: number[];
  onToggle: (index: number) => void;
  onClear: () => void;
};

export function IngredientList({ ingredients, checked, onToggle, onClear }: Props) {
  return (
    <section className="ingredients" aria-labelledby="ingredients-title">
      <div className="section-head">
        <h2 id="ingredients-title" className="headline-md">
          Ingredients <span className="section-head__count">({ingredients.length} items)</span>
        </h2>
        {checked.length > 0 && (
          <button className="section-head__action" onClick={onClear}>
            Clear checks
          </button>
        )}
      </div>
      {ingredients.length === 0 ? (
        <p className="muted">No ingredients were found in this video.</p>
      ) : (
        <>
          <p className="section-head__hint muted">Tap ingredients as you gather them to cross them off.</p>
          <ul className="ingredients__list">
            {ingredients.map((ingredient, i) => {
              const amount = formatAmount(ingredient);
              const done = checked.includes(i);
              return (
                <li key={i}>
                  <button
                    className={`ingredient${done ? " ingredient--done" : ""}`}
                    onClick={() => onToggle(i)}
                    role="checkbox"
                    aria-checked={done}
                  >
                    <span className="checkbox">{done && <Icon name="check" />}</span>
                    <span className="ingredient__text">
                      <span className="ingredient__line">
                        {amount && <span className="ingredient__amount">{amount} </span>}
                        {amount ? ingredient.name : capitalize(ingredient.name)}
                      </span>
                      {ingredient.note && <span className="ingredient__note">{ingredient.note}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
