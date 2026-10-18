import type { Step } from "../api";
import { Icon } from "./Icon";
import { StepTimer } from "./StepTimer";
import "./StepList.css";

type Props = {
  recipeId: number;
  recipeTitle: string;
  steps: Step[];
  done: number[];
  onToggle: (index: number) => void;
};

export function StepList({ recipeId, recipeTitle, steps, done, onToggle }: Props) {
  return (
    <section className="steps" aria-labelledby="steps-title">
      <div className="section-head">
        <h2 id="steps-title" className="headline-md">
          Instructions
        </h2>
        {steps.length > 0 && (
          <span className="section-head__count">
            {done.length} of {steps.length} completed
          </span>
        )}
      </div>
      {steps.length === 0 ? (
        <p className="muted">No steps were found in this video.</p>
      ) : (
        <>
          <p className="section-head__hint muted">Tap "Mark step done" as you cook.</p>
          <ol className="steps__list">
            {steps.map((step, i) => {
              const isDone = done.includes(i);
              return (
                <li key={i} id={`step-${i + 1}`} className={`step card${isDone ? " step--done" : ""}`}>
                  <span className="step__number label-caps">Step {String(i + 1).padStart(2, "0")}</span>
                  <p className="step__text">{step.text}</p>
                  <div className="step__actions">
                    {step.timer_seconds !== null && step.timer_seconds > 0 && (
                      <StepTimer
                        recipeId={recipeId}
                        recipeTitle={recipeTitle}
                        stepIndex={i}
                        seconds={step.timer_seconds}
                        label={step.timer_label}
                      />
                    )}
                    <button className="chip-btn step__done" onClick={() => onToggle(i)} aria-pressed={isDone}>
                      <Icon name={isDone ? "check_circle" : "check"} fill={isDone} />
                      {isDone ? "Done" : "Mark step done"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
