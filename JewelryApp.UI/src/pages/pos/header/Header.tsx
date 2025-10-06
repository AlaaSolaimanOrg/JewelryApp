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
  const pagesTitles = {
    "/": "POS Dashboard",
    "/productLookup": "Product Lookup",
    "/transactionHistory": "Transaction History",
    "/cartSummary": "Cart Summary",
    "/manualItemEntry": "Manual Item Entry",
    "/applyDiscount": "Apply Dicount",
    "/payment": "Payment",
    "/receipt": "Receipt Preview",
    "/ReceiptDelivery": "Receipt Delivery",
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

          <h1>GoldCraft POS</h1>
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
        <span id="posHeader-page-title">
          {pagesTitles[location.pathname as keyof typeof pagesTitles]}
        </span>
      </div>
    </>
  );
};

export default Header;
