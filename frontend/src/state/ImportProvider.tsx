import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, ApiError, type Job } from "../api";
import { readStorage, writeStorage } from "../lib/storage";
import { ImportContext, isActive } from "./imports";

const STORAGE_KEY = "simmer:jobs";
const DISMISSED_KEY = "simmer:dismissed";
const MAX_DISMISSED = 50;
const POLL_MS = 2000;
const DISCOVER_MS = 5000;

// Finished imports aren't worth restoring after a reload; running and failed ones are.
function loadJobs(): Job[] {
  return readStorage<Job[]>(localStorage, STORAGE_KEY, []).filter((j) => j.status !== "done");
}

export function ImportProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(loadJobs);
  const [recipesVersion, setRecipesVersion] = useState(0);
  const jobsRef = useRef(jobs);

  useEffect(() => {
    jobsRef.current = jobs;
    writeStorage(localStorage, STORAGE_KEY, jobs);
  }, [jobs]);

  // Poll every running job until it finishes
  const anyActive = jobs.some(isActive);
  useEffect(() => {
    if (!anyActive) return;
    const timer = setInterval(async () => {
      const active = jobsRef.current.filter(isActive);
      const results = await Promise.all(
        active.map((job) =>
          api.getJob(job.id).then(
            (updated) => ({ id: job.id, updated }),
            // 404: the job no longer exists (e.g. database reset), so drop it
            (err) => ({ id: job.id, updated: err instanceof ApiError && err.status === 404 ? null : job }),
          ),
        ),
      );
      setJobs((prev) =>
        prev.flatMap((job) => {
          const result = results.find((r) => r.id === job.id);
          if (!result) return [job];
          return result.updated ? [result.updated] : [];
        }),
      );
      if (results.some((r) => r.updated?.status === "done")) setRecipesVersion((v) => v + 1);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [anyActive]);

  // Pick up jobs started outside the app (e.g. the iOS share-sheet Shortcut).
  // Dismissed ids are remembered so recent failures don't keep coming back.
  const dismissedRef = useRef(new Set(readStorage<number[]>(localStorage, DISMISSED_KEY, [])));
  const discover = useCallback(async () => {
    let server: Job[];
    try {
      server = await api.listJobs();
    } catch {
      return;
    }
    setJobs((prev) => {
      const fresh = server.filter(
        (job) => !dismissedRef.current.has(job.id) && !prev.some((j) => j.id === job.id),
      );
      return fresh.length ? [...fresh, ...prev] : prev;
    });
  }, []);

  useEffect(() => {
    discover();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") discover();
    }, DISCOVER_MS);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      discover();
      // A recipe may have finished while the app was in the background
      setRecipesVersion((v) => v + 1);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [discover]);

  const startImport = useCallback(async (url: string) => {
    const job = await api.startImport(url);
    setJobs((prev) =>
      prev.some((j) => j.id === job.id) ? prev : [{ ...job, url: job.url ?? url }, ...prev],
    );
  }, []);

  const dismiss = useCallback((jobId: number) => {
    const dismissed = dismissedRef.current;
    dismissed.add(jobId);
    writeStorage(localStorage, DISMISSED_KEY, [...dismissed].slice(-MAX_DISMISSED));
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const retry = useCallback(
    async (job: Job) => {
      await startImport(job.url);
      dismiss(job.id);
    },
    [startImport, dismiss],
  );

  const value = useMemo(
    () => ({ jobs, recipesVersion, startImport, retry, dismiss }),
    [jobs, recipesVersion, startImport, retry, dismiss],
  );
  return <ImportContext value={value}>{children}</ImportContext>;
}
