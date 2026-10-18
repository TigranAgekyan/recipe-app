import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useMatch } from "react-router";
import { ImportProvider } from "../state/ImportProvider";
import { RecipesProvider } from "../state/RecipesProvider";
import { TimerProvider } from "../state/TimerProvider";
import { Icon } from "./Icon";
import { ImportPill } from "./ImportPill";
import { ImportSheet } from "./ImportSheet";
import { TimerDock } from "./TimerDock";
import "./Layout.css";

function BottomDock({ onAdd }: { onAdd: () => void }) {
  const onList = useMatch("/") !== null;
  const ref = useRef<HTMLDivElement>(null);

  // Expose the dock height so pages can pad their bottom and stay scrollable past it
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty("--dock-height", `${el.offsetHeight}px`));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bottom-dock" ref={ref}>
      <div className="bottom-dock__inner">
        {/* The list page shows full import cards, other pages get the pill */}
        {!onList && <ImportPill />}
        <TimerDock />
        {onList && (
          <button className="bottom-dock__fab" onClick={onAdd} aria-label="Import a recipe">
            <Icon name="add" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Root route: providers that must survive navigation, plus the floating dock. */
export function Layout() {
  const [importOpen, setImportOpen] = useState(false);
  const openImport = useCallback(() => setImportOpen(true), []);
  const closeImport = useCallback(() => setImportOpen(false), []);

  return (
    <ImportProvider>
      <RecipesProvider>
        <TimerProvider>
          <Outlet />
          <BottomDock onAdd={openImport} />
          <ImportSheet open={importOpen} onClose={closeImport} />
          <ScrollRestoration />
        </TimerProvider>
      </RecipesProvider>
    </ImportProvider>
  );
}
