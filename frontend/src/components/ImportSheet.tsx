import { useEffect } from "react";
import { Icon } from "./Icon";
import { ImportForm } from "./ImportForm";
import "./ImportSheet.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet version of the Quick Import screen. */
export function ImportSheet({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sheet-root">
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="import-sheet-title">
        <div className="sheet__handle" aria-hidden="true" />
        <div className="sheet__head">
          <div>
            <span className="sheet__tag label-caps">
              <Icon name="smart_display" fill />
              Video &amp; Shorts
            </span>
            <h2 id="import-sheet-title" className="headline-lg">
              Import from YouTube
            </h2>
          </div>
          <button className="sheet__close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <p className="sheet__intro muted">
          {import.meta.env.MODE === "demo"
            ? "This is a demo: paste any link and a sample recipe is added after a few seconds."
            : "Paste a cooking video or Shorts link to turn it into a clean recipe."}
        </p>
        <ImportForm onSubmitted={onClose} autoFocus />
      </div>
    </div>
  );
}
