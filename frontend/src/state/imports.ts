import { createContext, useContext } from "react";
import type { Job } from "../api";

export type ImportState = {
  jobs: Job[];
  /** Increments whenever an import finishes, so the recipe list can refetch. */
  recipesVersion: number;
  /** Throws ApiError if the backend rejects the URL. */
  startImport: (url: string) => Promise<void>;
  retry: (job: Job) => Promise<void>;
  dismiss: (jobId: number) => void;
};

export const ImportContext = createContext<ImportState | null>(null);

export function useImports(): ImportState {
  const value = useContext(ImportContext);
  if (!value) throw new Error("useImports must be used inside ImportProvider");
  return value;
}

export function isActive(job: Job) {
  return job.status === "pending" || job.status === "processing";
}
