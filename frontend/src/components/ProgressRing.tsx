import type { ReactNode } from "react";
import "./ProgressRing.css";

type Props = {
  /** 0..1 of time remaining */
  fraction: number;
  size: number;
  stroke?: number;
  children?: ReactNode;
};

export function ProgressRing({ fraction, size, stroke = 4, children }: Props) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
        />
      </svg>
      {children && <div className="ring__center">{children}</div>}
    </div>
  );
}
