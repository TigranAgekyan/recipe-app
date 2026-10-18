import { Link } from "react-router";
import { isActive, useImports } from "../state/imports";
import { Icon } from "./Icon";
import "./ImportPill.css";

/** Compact import status shown on pages other than the list. */
export function ImportPill() {
  const { jobs, dismiss } = useImports();
  if (jobs.length === 0) return null;

  const failed = jobs.filter((j) => j.status === "failed");
  const active = jobs.filter(isActive);
  const done = jobs.find((j) => j.status === "done" && j.recipe_id !== null);

  if (failed.length > 0) {
    return (
      <Link to="/" className="import-pill import-pill--failed">
        <Icon name="error" fill />
        <span className="import-pill__text">
          {failed.length === 1 ? "An import failed" : `${failed.length} imports failed`}
          <small>Tap to see what happened</small>
        </span>
        <Icon name="arrow_forward" />
      </Link>
    );
  }

  if (active.length > 0) {
    return (
      <Link to="/" className="import-pill">
        <span className="import-pill__spinner" aria-hidden="true" />
        <span className="import-pill__text">
          {active.length === 1 ? "Importing recipe…" : `Importing ${active.length} recipes…`}
          <small>Simmering in the background</small>
        </span>
      </Link>
    );
  }

  if (done) {
    return (
      <Link to={`/recipes/${done.recipe_id}`} className="import-pill import-pill--done" onClick={() => dismiss(done.id)}>
        <Icon name="check_circle" fill />
        <span className="import-pill__text">
          Recipe ready
          <small>Tap to open</small>
        </span>
        <Icon name="arrow_forward" />
      </Link>
    );
  }

  return null;
}
