import { useLocation, useNavigate } from "react-router";
import { formatClock } from "../lib/format";
import { remainingMs, useTimers, type StepTimer } from "../state/timers";
import { Icon } from "./Icon";
import { ProgressRing } from "./ProgressRing";
import "./TimerDock.css";

const MAX_VISIBLE = 2;

function TimerPill({ timer, left }: { timer: StepTimer; left: number }) {
  const { reset } = useTimers();
  const navigate = useNavigate();
  const location = useLocation();
  const stepHash = `#step-${timer.stepIndex + 1}`;
  const recipePath = `/recipes/${timer.recipeId}`;

  const open = () => {
    if (location.pathname === recipePath) {
      document.getElementById(stepHash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      navigate(recipePath + stepHash);
    }
  };

  return (
    <div className={`timer-pill timer-pill--${timer.status}`}>
      <button className="timer-pill__main" onClick={open}>
        <ProgressRing fraction={left / timer.durationMs} size={32} stroke={3.5}>
          <Icon name={timer.status === "ringing" ? "notifications_active" : timer.status === "paused" ? "pause" : "timer"} fill />
        </ProgressRing>
        <span className="timer-pill__text">
          <span className="timer-pill__label">{timer.label}</span>
          <span className="timer-pill__recipe">{timer.recipeTitle}</span>
        </span>
        <span className="timer-pill__clock">{timer.status === "ringing" ? "Done" : formatClock(left)}</span>
      </button>
      {timer.status === "ringing" && (
        <button className="timer-pill__stop" onClick={() => reset(timer.key)}>
          Stop
        </button>
      )}
    </div>
  );
}

/** Floating pills for timers that keep running while you browse other pages. */
export function TimerDock() {
  const { timers, now } = useTimers();
  if (timers.length === 0) return null;

  // Ringing first, then whatever finishes soonest
  const order = { ringing: 0, running: 1, paused: 2 };
  const sorted = timers
    .map((timer) => ({ timer, left: remainingMs(timer, now) }))
    .sort((a, b) => order[a.timer.status] - order[b.timer.status] || a.left - b.left);
  const hidden = sorted.length - MAX_VISIBLE;

  return (
    <div className="timer-dock">
      {sorted.slice(0, MAX_VISIBLE).map(({ timer, left }) => (
        <TimerPill key={timer.key} timer={timer} left={left} />
      ))}
      {hidden > 0 && (
        <p className="timer-dock__more">
          +{hidden} more {hidden === 1 ? "timer" : "timers"}
        </p>
      )}
    </div>
  );
}
