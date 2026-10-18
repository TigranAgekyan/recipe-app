import { formatClock, formatDuration } from "../lib/format";
import { remainingMs, timerKey, useTimers } from "../state/timers";
import { Icon } from "./Icon";
import { ProgressRing } from "./ProgressRing";
import "./StepTimer.css";

type Props = {
  recipeId: number;
  recipeTitle: string;
  stepIndex: number;
  seconds: number;
  label: string | null;
};

export function StepTimer({ recipeId, recipeTitle, stepIndex, seconds, label }: Props) {
  const { timers, now, start, pause, resume, reset } = useTimers();
  const key = timerKey(recipeId, stepIndex);
  const timer = timers.find((t) => t.key === key);
  const name = label ?? `Step ${stepIndex + 1} timer`;
  const durationMs = seconds * 1000;

  const startTimer = () => start({ recipeId, recipeTitle, stepIndex, label: name, durationMs });

  if (!timer) {
    return (
      <button className="chip-btn step-timer__start" onClick={startTimer}>
        <Icon name="timer" />
        {label ? `${label} · ` : "Start timer · "}
        {formatDuration(seconds)}
      </button>
    );
  }

  const left = remainingMs(timer, now);
  const statusText = { running: "Running", paused: "Paused", ringing: "Time's up!" }[timer.status];

  return (
    <div className={`step-timer step-timer--${timer.status}`} role="timer" aria-label={`${name}: ${formatClock(left)}`}>
      <div className="step-timer__display">
        <ProgressRing fraction={left / timer.durationMs} size={64} stroke={5}>
          <Icon name={timer.status === "ringing" ? "notifications_active" : "timer"} fill={timer.status !== "paused"} />
        </ProgressRing>
        <div className="step-timer__readout">
          <span className="step-timer__label">
            {name} · <span className="step-timer__status">{statusText}</span>
          </span>
          <span className="step-timer__clock">{formatClock(left)}</span>
        </div>
      </div>

      <div className="step-timer__controls">
        {timer.status === "running" && (
          <button className="btn btn--small step-timer__main" onClick={() => pause(key)}>
            <Icon name="pause" fill />
            Pause
          </button>
        )}
        {timer.status === "paused" && (
          <button className="btn btn--small step-timer__main" onClick={() => resume(key)}>
            <Icon name="play_arrow" fill />
            Resume
          </button>
        )}
        {timer.status === "ringing" ? (
          <>
            <button className="btn btn--small step-timer__main" onClick={() => reset(key)}>
              <Icon name="check" />
              Stop alarm
            </button>
            <button className="btn btn--small step-timer__secondary" onClick={startTimer}>
              <Icon name="restart_alt" />
              Restart
            </button>
          </>
        ) : (
          <button className="btn btn--small step-timer__secondary" onClick={() => reset(key)}>
            <Icon name="restart_alt" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
