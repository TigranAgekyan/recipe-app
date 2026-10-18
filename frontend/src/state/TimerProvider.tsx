import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { startAlarm, stopAlarm, unlockAudio } from "../lib/alarm";
import { useStoredState } from "../lib/storage";
import { TimersContext, timerKey, type StepTimer, type TimerMeta } from "./timers";

const TICK_MS = 250;

export function TimerProvider({ children }: { children: ReactNode }) {
  // Persisted so a running timer survives a reload or the PWA being reopened
  const [timers, setTimers] = useStoredState<StepTimer[]>("simmer:timers", []);
  const [now, setNow] = useState(() => Date.now());

  const anyRunning = timers.some((t) => t.status === "running");
  useEffect(() => {
    if (!anyRunning) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, TICK_MS);
    // Catch up immediately when returning from the background
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [anyRunning]);

  // Flip timers that hit zero to "ringing"
  const anyExpired = timers.some((t) => t.status === "running" && t.endsAt !== null && t.endsAt <= now);
  useEffect(() => {
    if (!anyExpired) return;
    setTimers((prev) =>
      prev.map((t) =>
        t.status === "running" && t.endsAt !== null && t.endsAt <= Date.now()
          ? { ...t, status: "ringing", endsAt: null, remainingMs: 0 }
          : t,
      ),
    );
  }, [anyExpired, setTimers]);

  const anyRinging = timers.some((t) => t.status === "ringing");
  useEffect(() => {
    if (anyRinging) startAlarm();
    else stopAlarm();
  }, [anyRinging]);
  useEffect(() => stopAlarm, []);

  const update = useCallback(
    (key: string, fn: (t: StepTimer) => StepTimer) =>
      setTimers((prev) => prev.map((t) => (t.key === key ? fn(t) : t))),
    [setTimers],
  );

  const start = useCallback(
    (meta: TimerMeta) => {
      unlockAudio(); // must run inside the tap, see lib/alarm.ts
      const key = timerKey(meta.recipeId, meta.stepIndex);
      const startedAt = Date.now();
      setNow(startedAt);
      const timer: StepTimer = {
        ...meta,
        key,
        status: "running",
        endsAt: startedAt + meta.durationMs,
        remainingMs: meta.durationMs,
      };
      setTimers((prev) => [...prev.filter((t) => t.key !== key), timer]);
    },
    [setTimers],
  );

  const pause = useCallback(
    (key: string) =>
      update(key, (t) =>
        t.status === "running" && t.endsAt
          ? { ...t, status: "paused", remainingMs: Math.max(0, t.endsAt - Date.now()), endsAt: null }
          : t,
      ),
    [update],
  );

  const resume = useCallback(
    (key: string) => {
      unlockAudio();
      const resumedAt = Date.now();
      setNow(resumedAt);
      update(key, (t) => (t.status === "paused" ? { ...t, status: "running", endsAt: resumedAt + t.remainingMs } : t));
    },
    [update],
  );

  const reset = useCallback(
    (key: string) => setTimers((prev) => prev.filter((t) => t.key !== key)),
    [setTimers],
  );

  const value = useMemo(
    () => ({ timers, now, start, pause, resume, reset }),
    [timers, now, start, pause, resume, reset],
  );
  return <TimersContext value={value}>{children}</TimersContext>;
}
