import { useLocation, useNavigate } from "react-router";
import { Icon } from "./Icon";
import "./AppHeader.css";

type Props = {
  /** Detail pages show a back button and a plain title instead of the wordmark. */
  title?: string;
};

export function AppHeader({ title }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Go back in history when we came from inside the app, otherwise to the list
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"));

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {title !== undefined && (
          <button className="app-header__back" onClick={goBack} aria-label="Back to cookbook">
            <Icon name="arrow_back_ios_new" />
          </button>
        )}
        <div className="app-header__logo" aria-hidden="true">
          <Icon name="soup_kitchen" fill />
        </div>
        {title === undefined ? (
          <div className="app-header__wordmark">
            <span className="app-header__name">Simmer</span>
            <span className="app-header__sub">Cookbook</span>
          </div>
        ) : (
          <h1 className="app-header__title">{title}</h1>
        )}
      </div>
    </header>
  );
}
