import { Link } from "react-router-dom";
import logo from "../../../assets/images/jewelary-logo.svg";
import "./unauthorized.scss";

const Unauthorized = () => {
  return (
    <div className="pos-app unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-brand">
          <img src={logo} alt="Logo" width={22} height={20} />
          <h1>Adi Jewelry POS</h1>
        </div>
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/login" className="unauthorized-login-btn">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
