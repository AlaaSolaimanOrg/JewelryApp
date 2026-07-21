import { Link } from "react-router-dom";
import { GiGoldBar } from "react-icons/gi";
import "./usedGold.scss";

const UsedGold = () => (
  <div className="used-gold-page">
    <div className="used-gold-empty">
      <GiGoldBar className="used-gold-icon" />
      <h2>Used Gold</h2>
      <p>Coming soon</p>
      <Link to="/" className="used-gold-back">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default UsedGold;
