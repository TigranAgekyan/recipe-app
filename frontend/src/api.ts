export type Ingredient = {
  name: string;
  quantity: string | null;
  unit: string | null;
  note: string | null;
};

export type Step = {
  text: string;
  timer_seconds: number | null;
  timer_label: string | null;
};

export type RecipeSummary = {
  id: number;
  title: string;
  source_url: string | null;
  servings: number | null;
  total_time_minutes: number | null;
  created_at: string;
};

export type Recipe = RecipeSummary & {
  ingredients: Ingredient[];
  steps: Step[];
};

export type Job = {
  id: number;
  url: string;
  status: "pending" | "processing" | "done" | "failed";
  error: string | null;
  recipe_id: number | null;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// FastAPI errors look like {"detail": "..."} or {"detail": [{"msg": "..."}]}
function errorMessage(body: string): string {
  try {
    const { detail } = JSON.parse(body);
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  } catch {
    // not JSON, fall through
  }
  return body || "Request failed";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  if (!res.ok) throw new ApiError(res.status, errorMessage(await res.text()));
  return res.json();
}

export const api = {
  listRecipes: () => request<RecipeSummary[]>("/recipes"),
  getRecipe: (id: number) => request<Recipe>(`/recipes/${id}`),
  getJob: (id: number) => request<Job>(`/jobs/${id}`),
  startImport: (url: string) =>
    request<Job>("/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }),
};
