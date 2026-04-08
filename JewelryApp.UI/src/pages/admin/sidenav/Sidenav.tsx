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
  FaUndo,
  FaChevronDown,
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubItemActive = (subItems) =>
    subItems?.some((sub) => location.pathname === sub.path);

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
      path: "/admin/inventory/products",
      subItems: [
        {
          label: "Products",
          path: "/admin/inventory/products",
        },
        {
          label: "Inventory Reports",
          path: "/admin/inventory/reports",
        },
          {
            label: "Melted Products",
            path: "/admin/inventory/melted",
          },
      ],
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
    {
      label: "Return Management",
      icon: <FaUndo className="icon" />,
      path: "/admin/returnManagement",
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

  const hasAdminRole = userInfo?.roles?.includes("Admin");
  const hasTerminalRole = userInfo?.roles?.includes("TerminalRole");
  const hasPosRole = userInfo?.roles?.includes("PosRole");
  const isTerminalOnlyUser = hasTerminalRole && !hasAdminRole;

  const filteredNavItems = isTerminalOnlyUser
    ? navItems
        .filter((item) =>
          ["Inventory", "Repair Management", "Return Management"].includes(
            item.label,
          ),
        )
        .map((item) =>
          item.label === "Inventory"
            ? {
                ...item,
                subItems: item.subItems?.filter(
                  (subItem) => subItem.path === "/admin/inventory/products",
                ),
              }
            : item,
        )
    : navItems;

  const filteredOperationItems = isTerminalOnlyUser
    ? operationItems.filter((item) => item.label === "Add Product")
    : operationItems;

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
          {filteredNavItems.map((item) => {
            const hasSubItems = !!item.subItems?.length;
            const expanded = openSections[item.label];
            const active =
              isActive(item.path) ||
              (hasSubItems && isSubItemActive(item.subItems));

            return (
              <div key={item.label}>
                <button
                  className={`nav-item ${active ? "active" : ""}`}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSection(item.label);

                      // Navigate to first sub item
                      if (item.subItems?.length) {
                        handleNavClick(item.subItems[0].path);
                      }
                    } else {
                      handleNavClick(item.path);
                    }
                  }}
                >
                  {/* LEFT SIDE */}
                  <div className="nav-left">
                    {item.icon}
                    <span className="nav-text">{item.label}</span>
                  </div>

                  {/* RIGHT SIDE ARROW */}
                  {hasSubItems && (
                    <FaChevronDown
                      className={`nav-arrow ${expanded ? "open" : ""}`}
                    />
                  )}
                </button>

                {hasSubItems && expanded && (
                  <div className="sub-nav">
                    {item?.subItems?.map((sub) => (
                      <button
                        key={sub.label}
                        className={`sub-nav-item ${
                          location.pathname === sub.path ? "active" : ""
                        }`}
                        onClick={() => handleNavClick(sub.path)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {hasPosRole && (
            <div>
              <div className="nav-section">System</div>

              <button
                className="nav-item no-subItems"
                onClick={handlePosRedirect}
              >
                <MdOutlinePointOfSale className="icon" />
                <span>POS</span>
              </button>
            </div>
          )}

          {filteredOperationItems.length > 0 && (
            <>
              <div className="nav-section">Operations</div>
              {filteredOperationItems.map((item) => (
                <button
                  key={item.label}
                  className={`nav-item no-subItems ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}

          <button
            className="nav-item no-subItems"
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
