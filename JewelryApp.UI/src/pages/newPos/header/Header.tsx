import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/images/jewelary-logo.svg";
import Clock from "../../../components/Clock/Clock";

import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./header.scss";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuth();

  const location = useLocation();
  const getPageTitle = (pathname: string) => {
    const routeTitles = [
      { path: "/productLookup", title: "Product Lookup" },
      { path: "/transactionHistory", title: "Transaction History" },
      { path: "/cartSummary", title: "Cart Summary" },
      { path: "/manualItemEntry", title: "Manual Item Entry" },
      { path: "/applyDiscount", title: "Apply Discount" },
      { path: "/payment", title: "Payment" },
      { path: "/receipt", title: "Receipt Preview" }, // This will match /receipt/*
      { path: "/ReceiptDelivery", title: "Receipt Delivery" },
      { path: "/sale", title: "Sale" },
      { path: "/", title: "POS Dashboard" },
    ];

    const matchedRoute = routeTitles.find(
      (route) =>
        pathname === route.path || pathname.startsWith(route.path + "/")
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

  return (
    <>
      <header id="posHeader">
        <Link to={"/"} className="logo text-decoration-none">
          <img src={logo} alt="Logo" width={36} height={32} />

          <h1>Adi Jewelry POS</h1>
        </Link>
        <div className="nav-controls">
          <div className="user-info">
            <FaUser />
            <span>{userInfo?.userName}</span>
          </div>
          <Clock />
          <button
            className="logout-btn"
            title="Logout"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: 12,
              color: "white",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </header>

      <div className="posHeader-page-title">
        <span id="posHeader-page-title">{getPageTitle(location.pathname)}</span>
      </div>
    </>
  );
};

export default Header;
