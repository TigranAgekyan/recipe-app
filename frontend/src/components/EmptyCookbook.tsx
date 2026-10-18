import { Icon } from "./Icon";
import { ImportForm } from "./ImportForm";
import "./EmptyCookbook.css";

const STEPS = [
  {
    icon: "ios_share",
    title: "Copy a YouTube or Shorts link",
    text: "Tap Share on any cooking video and copy the link.",
  },
  {
    icon: "auto_fix_high",
    title: "Simmer extracts the recipe",
    text: "Captions or audio become clean ingredients, steps and timers.",
  },
  {
    icon: "timer",
    title: "Cook from the counter",
    text: "Large type, tap-to-check ingredients and built-in step timers.",
  },
];

export function EmptyCookbook() {
  return (
    <div className="empty">
      <section className="empty__hero">
        <div className="empty__art" aria-hidden="true">
          <span className="empty__steam">
            <span />
            <span />
            <span />
          </span>
          <Icon name="soup_kitchen" fill />
        </div>
        <span className="empty__badge label-caps">
          <span className="empty__dot" />
          Distraction-free cooking
        </span>
        <h1 className="empty__title">Your Cookbook is Empty</h1>
        <p className="empty__lede muted">
          Turn your favorite YouTube cooking videos into clean, structured recipes that stay readable at arm's length on
          your kitchen counter.
        </p>
      </section>

      <section className="empty__import card">
        <h2 className="empty__import-title">
          <Icon name="play_circle" />
          Import YouTube Recipe
          <span className="empty__import-tag">videos or shorts</span>
        </h2>
        <ImportForm />
      </section>

      <section className="empty__how">
        <h2 className="empty__how-title label-caps">How Simmer works</h2>
        <ol className="empty__steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className={`empty__step empty__step--${i + 1}`}>
              <span className="empty__step-num">{i + 1}</span>
              <span className="empty__step-text">
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </span>
              <Icon name={step.icon} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
