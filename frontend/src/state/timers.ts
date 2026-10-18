import { createContext, useContext } from "react";

export type TimerStatus = "running" | "paused" | "ringing";

export type StepTimer = {
  key: string;
  recipeId: number;
  recipeTitle: string;
  stepIndex: number;
  label: string;
  durationMs: number;
  status: TimerStatus;
  /** Wall-clock end time while running; remaining time is derived from it so
   * the countdown stays correct after iOS suspends the page. */
  endsAt: number | null;
  /** Remaining time while paused. */
  remainingMs: number;
};

export type TimerMeta = Pick<StepTimer, "recipeId" | "recipeTitle" | "stepIndex" | "label" | "durationMs">;

export type TimersState = {
  timers: StepTimer[];
  now: number;
  start: (meta: TimerMeta) => void;
  pause: (key: string) => void;
  resume: (key: string) => void;
  /** Stops and removes the timer (also silences it when ringing). */
  reset: (key: string) => void;
};

export const TimersContext = createContext<TimersState | null>(null);

export function useTimers(): TimersState {
  const value = useContext(TimersContext);
  if (!value) throw new Error("useTimers must be used inside TimerProvider");
  return value;
}

export function timerKey(recipeId: number, stepIndex: number) {
  return `${recipeId}:${stepIndex}`;
}

export function remainingMs(timer: StepTimer, now: number) {
  if (timer.status === "running" && timer.endsAt) return Math.max(0, timer.endsAt - now);
  if (timer.status === "ringing") return 0;
  return timer.remainingMs;
}
