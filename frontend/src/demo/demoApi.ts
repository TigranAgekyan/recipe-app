import { ApiError, type Job, type Recipe, type RecipeSummary } from "../api";
import { importPool, seedRecipes } from "./recipes";

// Stand-in for the backend in the demo build (`npm run build:demo`), used
// by api.ts when Vite's mode is "demo". Everything lives in memory, so a
// reload starts fresh. An import walks through the same states as the real
// worker (pending -> processing -> done) on a timer, then adds the next
// recipe from importPool instead of transcribing the video.

const PENDING_MS = 1500;
const DONE_MS = 7000;

type DemoJob = Job & { startedAt: number };

// Created on first use rather than at import time: with no top-level work,
// regular builds can drop this module even though api.ts imports it
let state: { recipes: Recipe[]; jobs: DemoJob[]; nextRecipeId: number; nextJobId: number; nextPoolIndex: number } | null = null;

function db() {
  if (!state) {
    const recipes = structuredClone(seedRecipes);
    state = { recipes, jobs: [], nextRecipeId: Math.max(...recipes.map((r) => r.id)) + 1, nextJobId: 1, nextPoolIndex: 0 };
  }
  return state;
}

// Short random delay so loading states show up like they would over the network
const latency = () => new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 200));

function summary(r: Recipe): RecipeSummary {
  const { id, title, source_url, servings, total_time_minutes, created_at } = r;
  return { id, title, source_url, servings, total_time_minutes, created_at };
}

// Moves a job along based on how long ago it started, finishing it into a new recipe
function advance(job: DemoJob) {
  const s = db();
  const elapsed = Date.now() - job.startedAt;
  if (job.status === "pending" && elapsed >= PENDING_MS) job.status = "processing";
  if (job.status === "processing" && elapsed >= DONE_MS) {
    const template = importPool[s.nextPoolIndex++ % importPool.length];
    const recipe: Recipe = { ...structuredClone(template), id: s.nextRecipeId++, created_at: new Date().toISOString() };
    s.recipes.unshift(recipe);
    job.status = "done";
    job.recipe_id = recipe.id;
  }
}

function publicJob(job: DemoJob): Job {
  const { id, url, status, error, recipe_id } = job;
  return { id, url, status, error, recipe_id };
}

export const demoApi = {
  listRecipes: async () => {
    await latency();
    db().jobs.forEach(advance);
    return db().recipes.map(summary);
  },
  getRecipe: async (id: number) => {
    await latency();
    const recipe = db().recipes.find((r) => r.id === id);
    if (!recipe) throw new ApiError(404, "Recipe not found");
    return structuredClone(recipe);
  },
  getJob: async (id: number) => {
    await latency();
    const job = db().jobs.find((j) => j.id === id);
    if (!job) throw new ApiError(404, "Job not found");
    advance(job);
    return publicJob(job);
  },
  listJobs: async () => {
    await latency();
    db().jobs.forEach(advance);
    return db().jobs.filter((j) => j.status !== "done").map(publicJob);
  },
  startImport: async (url: string) => {
    await latency();
    // Same check and message as the backend's Pydantic HttpUrl validation
    try {
      new URL(url);
    } catch {
      throw new ApiError(422, "Input should be a valid URL, relative URL without a base");
    }
    const s = db();
    const job: DemoJob = { id: s.nextJobId++, url, status: "pending", error: null, recipe_id: null, startedAt: Date.now() };
    s.jobs.unshift(job);
    return publicJob(job);
  },
};
