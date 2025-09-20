import { Link } from "react-router-dom";
import logo from "../../../assets/images/jewelary-logo.svg";
import "./unauthorized.scss";

const Unauthorized = () => {
  return (
    <div id="unauthorized">
      <div className="unauthorized-container">
        <div
          className="logo text-decoration-none"
          style={{ marginBottom: "1.5rem" }}
        >
          <img src={logo} alt="Logo" width={36} height={32} />
          <h1>GoldCraft POS</h1>
        </div>
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/login" className="btn-gold">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
