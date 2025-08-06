import { FaPlusCircle } from "react-icons/fa";
import { RiHistoryFill } from "react-icons/ri";
import "./home.scss";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="page-content active">
      <div className="home-container">
        <div className="home-icon">
          <i className="fas fa-cash-register"></i>
        </div>
        <h1 className="home-title">GoldCraft Point of Sale</h1>
        <p className="home-subtitle">
          Efficiently manage your jewelry store sales with our specialized POS
          system. Scan gold items, calculate prices by weight, and process
          payments seamlessly.
        </p>
        <Link to={"/productLookup"}>
          <button className="btn btn-primary btn-lg">
            <FaPlusCircle /> Start New Sale
          </button>
        </Link>

        <div className="recent-transactions">
          <div className="recent-header">
            <h3>Recent Transactions</h3>
            <Link to={"/transactionHistory"}>
              <button className="btn btn-secondary">
                <RiHistoryFill />
                View All
              </button>
            </Link>
          </div>
          <ul className="transaction-list">
            <li className="transaction-item">
              <span className="transaction-id">TR-2023-0582</span>
              <span className="transaction-amount">$1,850.75</span>
            </li>
            <li className="transaction-item">
              <span className="transaction-id">TR-2023-0581</span>
              <span className="transaction-amount">$2,420.50</span>
            </li>
            <li className="transaction-item">
              <span className="transaction-id">TR-2023-0580</span>
              <span className="transaction-amount">$3,125.25</span>
            </li>
            <li className="transaction-item">
              <span className="transaction-id">TR-2023-0579</span>
              <span className="transaction-amount">$980.30</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
