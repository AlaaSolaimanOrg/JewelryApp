import { FaMoon, FaSun, FaSyncAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { getPageTitle } from "./AdminHeader.utils";
import "./adminHeader.scss";

const AdminHeader = () => {
  const { userInfo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const initials = userInfo?.userName?.slice(0, 2).toUpperCase() || "AM";

  return (
    <header className="adminHeader">
      <div className="header-left">
        <span className="header-title">{pageTitle}</span>
        <span className="header-date">{today}</span>
      </div>

      <div className="header-actions">
        <button
          className="mode-btn"
          onClick={toggleTheme}
          title="Light / dark mode"
          aria-label="Toggle light and dark mode"
        >
          {theme === "dark" ? <FaSun size={15} /> : <FaMoon size={15} />}
        </button>

        <button
          className="refresh-btn"
          onClick={() => window.location.reload()}
        >
          <FaSyncAlt size={12} />
          <span className="refresh-text">Refresh</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{userInfo?.userName}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
