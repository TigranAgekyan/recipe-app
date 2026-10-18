import { useId, useState, type FormEvent } from "react";
import { useImports } from "../state/imports";
import { Icon } from "./Icon";
import "./ImportForm.css";

const canPaste = typeof navigator !== "undefined" && !!navigator.clipboard?.readText;

function looksLikeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type Props = {
  onSubmitted?: () => void;
  autoFocus?: boolean;
};

export function ImportForm({ onSubmitted, autoFocus }: Props) {
  const { startImport } = useImports();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    if (!looksLikeUrl(value)) {
      setError("That doesn't look like a link. Paste the full YouTube URL.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await startImport(value);
      setUrl("");
      onSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start the import.");
    } finally {
      setSubmitting(false);
    }
  };

  // iOS shows its own "Paste" confirmation; it only works from a tap
  const paste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) {
        setUrl(text);
        setError(null);
      }
    } catch {
      // permission denied or empty clipboard
    }
  };

  return (
    <form className="import-form" onSubmit={submit} noValidate>
      <div className="import-form__label-row">
        <label htmlFor={inputId} className="import-form__label">
          Video link
        </label>
        {canPaste && (
          <button type="button" className="import-form__paste" onClick={paste}>
            <Icon name="content_paste" />
            Paste
          </button>
        )}
      </div>

      <div className={`import-form__field${error ? " import-form__field--error" : ""}`}>
        <Icon name="link" />
        <input
          id={inputId}
          type="url"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="Paste a YouTube video or Shorts link…"
          value={url}
          autoFocus={autoFocus}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {url && (
          <button type="button" className="import-form__clear" onClick={() => setUrl("")} aria-label="Clear link">
            <Icon name="cancel" />
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="import-form__error" role="alert">
          <Icon name="error" />
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={!url.trim() || submitting}>
        <Icon name="auto_fix_high" />
        {submitting ? "Sending…" : "Extract Recipe"}
      </button>
      <p className="import-form__hint">Reads the captions (or transcribes the audio), then pulls out ingredients, steps and timers.</p>
    </form>
  );
}
