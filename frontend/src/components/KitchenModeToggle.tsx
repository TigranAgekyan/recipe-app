import { wakeLockSupported } from "../lib/useWakeLock";
import { Icon } from "./Icon";
import "./KitchenModeToggle.css";

type Props = {
  on: boolean;
  onChange: (on: boolean) => void;
};

export function KitchenModeToggle({ on, onChange }: Props) {
  return (
    <label className={`kitchen-mode${on ? " kitchen-mode--on" : ""}`}>
      <span className="kitchen-mode__icon">
        <Icon name="visibility" />
      </span>
      <span className="kitchen-mode__text">
        <strong>Kitchen Mode</strong>
        <span>{wakeLockSupported ? "Larger type, and the screen stays on" : "Larger type for reading at the counter"}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="kitchen-mode__input"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="kitchen-mode__switch" aria-hidden="true" />
    </label>
  );
}
