import { MotionConfig, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useWindowWidth } from "../lib/useWindowWidth";
import "./GooeySearch.css";

const COLLAPSED_WIDTH = 112;
const MAX_EXPANDED_WIDTH = 280;
const EXPANDED_OFFSET = 50;
/** Phone header space not available to the open bar: gutters, logo, gap and icon bubble. */
const HEADER_RESERVED = 32 + 36 + 12 + EXPANDED_OFFSET;

const transition = { duration: 0.4, type: "spring" as const, bounce: 0.25 };

const bubbleVariants = {
  collapsed: { scale: 0, opacity: 0 },
  expanded: { scale: 1, opacity: 1 },
};

function SearchIcon({ layoutId }: { layoutId: string }) {
  return (
    <motion.svg
      layoutId={layoutId}
      className="gooey-search__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/** Adapted from Aceternity UI's Gooey Input: a pill that opens into a field, with its icon splitting off. */
export function GooeySearch({ value, onChange }: Props) {
  const id = useId().replace(/[^\w-]/g, "");
  const filterId = `gooey-search-filter-${id}`;
  const iconId = `gooey-search-icon-${id}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const state = open ? "expanded" : "collapsed";
  const expandedWidth = Math.min(MAX_EXPANDED_WIDTH, useWindowWidth() - HEADER_RESERVED);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="gooey-search" role="search">
        <svg className="gooey-search__defs" aria-hidden="true">
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={5} result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="gooey-search__goo" style={{ filter: `url(#${filterId})` }}>
          <motion.div
            className="gooey-search__row"
            initial={{ width: COLLAPSED_WIDTH, marginLeft: 0 }}
            animate={open ? { width: expandedWidth, marginLeft: EXPANDED_OFFSET } : { width: COLLAPSED_WIDTH, marginLeft: 0 }}
            transition={transition}
          >
            {open ? (
              <input
                ref={inputRef}
                className="gooey-search__surface gooey-search__input"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search recipes…"
                aria-label="Search recipes"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => !value && setOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    onChange("");
                    setOpen(false);
                  }
                }}
              />
            ) : (
              <button className="gooey-search__surface gooey-search__trigger" onClick={() => setOpen(true)}>
                <SearchIcon layoutId={iconId} />
                Search
              </button>
            )}
          </motion.div>

          <motion.div className="gooey-search__bubble" variants={bubbleVariants} initial="collapsed" animate={state} transition={transition}>
            <div className="gooey-search__surface gooey-search__bubble-surface">
              <SearchIcon layoutId={iconId} />
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
