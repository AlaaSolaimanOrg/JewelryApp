import { Link } from "react-router-dom";
import Clock from "../../../components/Clock/Clock";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaCog,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import "./posHeader.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";

const PosHeader = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminUser = userInfo?.roles?.includes("Admin");
  const hasTerminalRole = userInfo?.roles?.includes("TerminalRole");
  const canAccessAdminPanel = isAdminUser || hasTerminalRole;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setUserInfo((pre) => {
      return { ...pre, roles: [] };
    });
    navigate("/login");
  };

  // Admin panel handler
  const handleAdminPanel = () => {
    if (isAdminUser) {
      navigate("/admin/dashboard");
      return;
    }

    if (hasTerminalRole) {
      navigate("/admin/inventory/products");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="posHeader">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <FaBars size={20} />
        </button>

        <Link to={"/"} className="logo text-decoration-none">
          <h1>Adi Jewelry POS</h1>
        </Link>
      </div>

      <div className={`nav-controls ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="nav-controls-top">
          <div className="user-info">
            <FaUser />
            <span>{userInfo?.userName}</span>
          </div>

          <Clock />

          <button
            className="mode-btn"
            onClick={toggleTheme}
            title="Light / dark mode"
            aria-label="Toggle light and dark mode"
          >
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          {canAccessAdminPanel && (
            <button
              className="admin-btn"
              title="Admin Panel"
              onClick={handleAdminPanel}
            >
              <FaCog size={18} />
              <span className="admin-text">Admin Panel</span>
            </button>
          )}

          <button className="logout-btn" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt size={20} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />
      )}
    </header>
  );
};

export default PosHeader;
