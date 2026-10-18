import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, ApiError, type Job } from "../api";
import { readStorage, writeStorage } from "../lib/storage";
import { ImportContext, isActive } from "./imports";

const STORAGE_KEY = "simmer:jobs";
const POLL_MS = 2000;

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

  const startImport = useCallback(async (url: string) => {
    const job = await api.startImport(url);
    setJobs((prev) => [{ ...job, url: job.url ?? url }, ...prev]);
  }, []);

  const dismiss = useCallback((jobId: number) => {
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
