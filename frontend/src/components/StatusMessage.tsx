import type { ReactNode } from "react";
import { Icon } from "./Icon";
import "./StatusMessage.css";

type Props = {
  icon: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

/** Centered message for load errors and not-found states. */
export function StatusMessage({ icon, title, children, action }: Props) {
  return (
    <div className="status-message" role="status">
      <div className="status-message__icon">
        <Icon name={icon} />
      </div>
      <h2 className="headline-md">{title}</h2>
      {children && <p className="status-message__body muted">{children}</p>}
      {action}
    </div>
  );
}
