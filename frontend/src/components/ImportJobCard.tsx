import { useState } from "react";
import { Link } from "react-router";
import type { Job } from "../api";
import { displayUrl, isShorts, thumbnailUrl, youtubeId } from "../lib/youtube";
import { useImports } from "../state/imports";
import { Icon } from "./Icon";
import "./ImportJobCard.css";

const NOT_A_RECIPE = "doesn't seem to contain a recipe";

function JobAvatar({ job }: { job: Job }) {
  const id = youtubeId(job.url);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`job-card__avatar job-card__avatar--${job.status}`}>
      {id && !failed ? (
        <img
          src={thumbnailUrl(id)}
          alt=""
          onError={() => setFailed(true)}
          // Unavailable videos return a 120px grey placeholder
          onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setFailed(true)}
        />
      ) : (
        <Icon name="smart_display" />
      )}
    </div>
  );
}

function FailedDetails({ job }: { job: Job }) {
  const { retry, dismiss } = useImports();
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const notRecipe = job.error?.includes(NOT_A_RECIPE);

  const onRetry = async () => {
    setRetrying(true);
    setRetryError(null);
    try {
      await retry(job);
    } catch (err) {
      setRetryError(err instanceof Error ? err.message : "Couldn't retry");
      setRetrying(false);
    }
  };

  return (
    <>
      <p className="job-card__message">
        {notRecipe
          ? "We couldn't find a recipe in this video. Try a cooking video with spoken or written steps."
          : "Something went wrong while extracting this recipe."}
      </p>
      {job.error && !notRecipe && (
        <button className={`job-card__error${expanded ? " job-card__error--open" : ""}`} onClick={() => setExpanded((e) => !e)}>
          {job.error}
        </button>
      )}
      {retryError && <p className="job-card__message job-card__message--error">{retryError}</p>}
      <div className="job-card__actions">
        {!notRecipe && (
          <button className="chip-btn job-card__retry" onClick={onRetry} disabled={retrying}>
            <Icon name="refresh" />
            {retrying ? "Retrying…" : "Retry"}
          </button>
        )}
        <button className="chip-btn" onClick={() => dismiss(job.id)}>
          Dismiss
        </button>
      </div>
    </>
  );
}

export function ImportJobCard({ job }: { job: Job }) {
  const { dismiss } = useImports();
  const kind = isShorts(job.url) ? "Short" : "video";

  const heading = {
    pending: "Queued for import",
    processing: `Importing ${kind}`,
    done: "Recipe ready",
    failed: "Import failed",
  }[job.status];

  return (
    <article className={`job-card card job-card--${job.status}`} aria-live="polite">
      <div className="job-card__head">
        <JobAvatar job={job} />
        <div className="job-card__titles">
          <h3 className="job-card__heading">
            {heading}
            {job.status === "processing" && <span className="job-card__live label-caps">Live</span>}
          </h3>
          <p className="job-card__url">{displayUrl(job.url)}</p>
        </div>
        {(job.status === "done" || job.status === "failed") && (
          <button className="job-card__close" onClick={() => dismiss(job.id)} aria-label="Dismiss">
            <Icon name="close" />
          </button>
        )}
      </div>

      {(job.status === "pending" || job.status === "processing") && (
        <div className="job-card__progress">
          <p className="job-card__stage">
            <Icon name={job.status === "pending" ? "hourglass_top" : "autorenew"} />
            {job.status === "pending" ? "Waiting for the kitchen worker…" : "Transcribing and extracting the recipe…"}
          </p>
          <div className="job-card__bar" role="progressbar" aria-label="Import in progress">
            <span />
          </div>
        </div>
      )}

      {job.status === "done" && job.recipe_id !== null && (
        <div className="job-card__actions">
          <Link to={`/recipes/${job.recipe_id}`} className="chip-btn job-card__open" onClick={() => dismiss(job.id)}>
            Open recipe
            <Icon name="arrow_forward" />
          </Link>
        </div>
      )}

      {job.status === "failed" && <FailedDetails job={job} />}
    </article>
  );
}
