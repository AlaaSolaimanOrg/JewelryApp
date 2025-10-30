import { AiFillHome } from "react-icons/ai";
import {
  FaBox,
  FaChartLine,
  FaGem,
  FaTag,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./sidenav.scss";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      icon: <AiFillHome className="icon homeIcon" />,
      path: "/admin/dashboard",
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
    // {
    //   label: "Settings",
    //   icon: <FaCog className="icon" />,
    //   path: "/admin/settings",
    // },
  ];

  const operationItems = [
    // {
    //   label: "Print Tags",
    //   icon: <FaPrint className="icon" />,
    //   path: "/admin/print-tags",
    // },
    // {
    //   label: "Export Data",
    //   icon: <FaFile className="icon" />,
    //   path: "/admin/export-data",
    // },
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

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <FaGem className="icon" />
        </div>
        <div className="logo-text">
          <h1>
            Adi<span> Jewelary</span>
          </h1>
          <small>Inventory System</small>
        </div>
      </div>

      <div className="nav-links">
        <div className="nav-section">Inventory</div>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className="nav-section">Operations</div>
        {operationItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          className="nav-item logout-btn"
          onClick={handleLogout}
          style={{ marginTop: "16px", color: "#d9534f" }}
        >
          <FaUser className="icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
