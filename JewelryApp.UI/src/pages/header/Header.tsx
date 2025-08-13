import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/jewelary-logo.svg";
import Clock from "../../components/Clock/Clock";

import "./header.scss";
import { FaGem, FaUser } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const pagesTitles = {
    "/": "POS Dashboard",
    "/productLookup": "Product Lookup",
    "/transactionHistory": "Transaction History",
    "/cartSummary": "Cart Summary",
    "/manualItemEntry": "Manual Item Entry",
    "/applyDiscount": "Apply Dicount",
  };

  return (
    <>
      <header className="header">
        <Link to={"/"} className="logo text-decoration-none">
          <img src={logo} alt="Logo" width={36} height={32} />

          <FaGem />
          <h1>GoldCraft POS</h1>
        </Link>
        <div className="nav-controls">
          <div className="user-info">
            <FaUser/>
            <span>Sarah Johnson</span>
          </div>
          <Clock />
          {/* <div id="current-time">{currentTime}</div> */}
        </div>
      </header>

      <div className="page-title">
        <span id="page-title">
          {pagesTitles[location.pathname as keyof typeof pagesTitles]}
        </span>
      </div>
    </>
  );
};

export default Header;
