import { useEffect, useState } from "react";
import { api, type Job, type Recipe, type RecipeSummary } from "./api";

export default function App() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [url, setUrl] = useState("");
  const [job, setJob] = useState<Job | null>(null);

  const loadRecipes = () => api.listRecipes().then(setRecipes);
  useEffect(() => { loadRecipes(); }, []);

  // Poll the job every 2s until it finishes
  useEffect(() => {
    if (!job || job.status === "done" || job.status === "failed") return;
    const timer = setInterval(async () => {
      const updated = await api.getJob(job.id);
      setJob(updated);
      if (updated.status === "done") loadRecipes();
    }, 2000);
    return () => clearInterval(timer);
  }, [job]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setJob(await api.startImport(url));
    setUrl("");
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1>Recipes</h1>

      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube link"
          style={{ flex: 1 }}
        />
        <button type="submit">Import</button>
      </form>

      {job && (
        <p>
          Import #{job.id}: {job.status}
          {job.error && ` — ${job.error}`}
        </p>
      )}

      {selected ? (
        <article>
          <button onClick={() => setSelected(null)}>← Back</button>
          <h2>{selected.title}</h2>
          <h3>Ingredients</h3>
          <ul>
            {selected.ingredients.map((i, idx) => (
              <li key={idx}>
                {[i.quantity, i.unit, i.name].filter(Boolean).join(" ")}
                {i.note && ` (${i.note})`}
              </li>
            ))}
          </ul>
          <h3>Steps</h3>
          <ol>
            {selected.steps.map((s, idx) => (
              <li key={idx}>
                {s.text}
                {s.timer_seconds && (
                  <button>⏱ {s.timer_label ?? "Timer"} · {Math.round(s.timer_seconds / 60)} min</button>
                )}
              </li>
            ))}
          </ol>
        </article>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <button onClick={() => api.getRecipe(r.id).then(setSelected)}>
                {r.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}