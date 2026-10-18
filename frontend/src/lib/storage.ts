import { useEffect, useState } from "react";

// Storage can throw (private mode, blocked site data), so every access is guarded.

export function readStorage<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/** useState that mirrors its value into localStorage or sessionStorage. */
export function useStoredState<T>(key: string, initial: T, storage: Storage = localStorage) {
  const [value, setValue] = useState<T>(() => readStorage(storage, key, initial));
  useEffect(() => writeStorage(storage, key, value), [storage, key, value]);
  return [value, setValue] as const;
}
