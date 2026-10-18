import { useEffect } from "react";

export const wakeLockSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;

/** Keeps the screen on while enabled. The OS drops the lock when the page is
 * hidden, so it is requested again whenever the page becomes visible. */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !wakeLockSupported) return;
    let sentinel: WakeLockSentinel | null = null;
    let active = true;

    const acquire = async () => {
      if (document.visibilityState !== "visible" || (sentinel && !sentinel.released)) return;
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (active) sentinel = lock;
        else void lock.release();
      } catch {
        // denied, e.g. low power mode
      }
    };

    void acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", acquire);
      void sentinel?.release();
    };
  }, [enabled]);
}
