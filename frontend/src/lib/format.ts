import type { Ingredient } from "../api";

/** 45 -> "45 min", 75 -> "1 h 15 min", 120 -> "2 h" */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function formatServings(servings: number): string {
  return `${servings} ${servings === 1 ? "serving" : "servings"}`;
}

/** Timer length for buttons: 45 -> "45 sec", 90 -> "1 min 30 sec", 900 -> "15 min" */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const s = seconds % 60;
  if (s && seconds < 600) return `${Math.floor(seconds / 60)} min ${s} sec`;
  return formatMinutes(Math.round(seconds / 60));
}

/** Countdown display: "4:05", "1:02:09" */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** "1 1/2" + "cups" -> "1 1/2 cups"; null when neither is set */
export function formatAmount(ingredient: Ingredient): string | null {
  const amount = [ingredient.quantity, ingredient.unit].filter(Boolean).join(" ");
  return amount || null;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
