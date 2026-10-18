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
  servings: number | null;
  total_time_minutes: number | null;
  created_at: string;
};

export type Recipe = RecipeSummary & {
  source_url: string | null;
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
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