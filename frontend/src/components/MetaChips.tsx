import { formatMinutes, formatServings } from "../lib/format";
import { Icon } from "./Icon";
import "./MetaChips.css";

type Props = {
  totalTimeMinutes: number | null;
  servings: number | null;
  /** "overlay" sits on top of a photo with a frosted background. */
  variant?: "plain" | "overlay";
};

/** Time and servings pills; each is hidden when the value is unknown. */
export function MetaChips({ totalTimeMinutes, servings, variant = "plain" }: Props) {
  if (totalTimeMinutes === null && servings === null) return null;
  return (
    <ul className={`meta-chips meta-chips--${variant}`}>
      {totalTimeMinutes !== null && (
        <li className="meta-chip">
          <Icon name="schedule" />
          {formatMinutes(totalTimeMinutes)}
          {variant === "overlay" && " total"}
        </li>
      )}
      {servings !== null && (
        <li className="meta-chip">
          <Icon name="restaurant" />
          {formatServings(servings)}
        </li>
      )}
    </ul>
  );
}
