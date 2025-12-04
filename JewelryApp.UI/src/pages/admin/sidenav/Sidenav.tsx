import { AiFillHome } from "react-icons/ai";
import {
  FaBox,
  FaChartLine,
  FaGem,
  FaTag,
  FaUser,
  FaUsers,
  FaBars,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import { MdOutlineAddShoppingCart, MdOutlinePointOfSale } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import "./sidenav.scss";
import { GiPieChart } from "react-icons/gi";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo, userInfo } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      icon: <AiFillHome className="icon homeIcon" />,
      path: "/admin/dashboard",
    },
    {
      label: "Analytics",
      icon: <GiPieChart className="icon homeIcon" />,
      path: "/admin/analytics",
    },
    {
      label: "Inventory",
      icon: <FaBox className="icon" />,
      path: "/admin/inventory",
    },
    {
      label: "Pricing",
      icon: <FaTag className="icon" />,
      path: "/admin/pricing",
    },
    {
      label: "Sales Reports",
      icon: <FaChartLine className="icon" />,
      path: "/admin/sales-reports",
    },
    {
      label: "Customers",
      icon: <FaUsers className="icon" />,
      path: "/admin/customers",
    },
    { label: "Staff", icon: <FaUser className="icon" />, path: "/admin/staff" },
    {
      label: "Repair Management",
      icon: <FaTools className="icon" />,
      path: "/admin/repairManagement",
    },
  ];

  const operationItems = [
    {
      label: "Add Product",
      icon: <MdOutlineAddShoppingCart className="icon addIcon" />,
      path: "/admin/addProduct",
    },
    {
      label: "Add Staff",
      icon: <TiUserAdd className="icon addIcon" />,
      path: "/admin/addStaff",
    },
  ];

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest(".sidebar")) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

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

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
  };

  const hasPosRole = userInfo?.roles?.includes("PosRole");

  const handlePosRedirect = () => {
    navigate("/");
  };
  return (
    <>
      {!isMobileOpen && (
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <FaBars />
        </button>
      )}

      {isMobileOpen && <div className="sidebar-overlay" />}

      <aside className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <FaGem className="icon" />
            </div>
            <div className="logo-text">
              <h1>
                Adi<span> Jewelry</span>
              </h1>
              <small>Inventory System</small>
            </div>
          </div>
          {isMobileOpen && (
            <button
              className="close-sidebar-mobile"
              onClick={() => setIsMobileOpen(false)}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="nav-links">
          <div className="nav-section">Inventory</div>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {hasPosRole && (
            <div>
              <div className="nav-section">System</div>

              <button className="nav-item " onClick={handlePosRedirect}>
                <MdOutlinePointOfSale className="icon" />
                <span>POS</span>
              </button>
            </div>
          )}

          <div className="nav-section">Operations</div>
          {operationItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <button
            className="nav-item"
            onClick={handleLogout}
            style={{ marginTop: "16px", color: "#d9534f" }}
          >
            <FaUser className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
