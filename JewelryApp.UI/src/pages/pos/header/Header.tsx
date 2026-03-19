import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/images/jewelary-logo.svg";
import Clock from "../../../components/Clock/Clock";
import { FaUser, FaSignOutAlt, FaBars, FaCog } from "react-icons/fa";
import "./header.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminUser = userInfo?.roles?.includes("Admin");
  const hasTerminalRole = userInfo?.roles?.includes("TerminalRole");
  const canAccessAdminPanel = isAdminUser || hasTerminalRole;

  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    const routeTitles = [
      { path: "/", title: "POS Dashboard" },
      { path: "/transactionHistory", title: "Transaction History" },
      { path: "/receipt", title: "Receipt Preview" },
      { path: "/sale", title: "Sale" },
    ];

    const matchedRoute = routeTitles.find(
      (route) =>
        pathname === route.path || pathname.startsWith(route.path + "/"),
    );

    return matchedRoute?.title || "POS Dashboard";
  };

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
    <>
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
            <img src={logo} alt="Logo" width={36} height={32} />
            <h1>Adi Jewelry POS</h1>
          </Link>
        </div>

        <div
          className={`nav-controls ${isMobileMenuOpen ? "mobile-open" : ""}`}
        >
          <div className="nav-controls-top">
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

            <div className="user-info">
              <FaUser />
              <span>{userInfo?.userName}</span>
            </div>

            <Clock />

            <button
              className="logout-btn"
              title="Logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={20} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />
        )}
      </header>

      <div className="posHeader-page-title">
        <span id="posHeader-page-title">{getPageTitle(location.pathname)}</span>
      </div>
    </>
  );
};

export default Header;
