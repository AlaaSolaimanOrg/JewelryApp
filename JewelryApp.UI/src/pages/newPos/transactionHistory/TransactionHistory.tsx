import { FaHistory, FaPrint, FaSearch, FaSms } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./transactionHistory.scss";

const TransactionHistory = () => {
  return (
    <div id="transaction-history-page" className="page-content">
      <h2>
        <FaHistory /> Past Transactions
      </h2>
      <p className="subtitle">View previous sales records</p>

      <div className="search-container" style={{ marginBottom: "25px" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search transactions..."
        />
        <button className="search-btn">
          <FaSearch /> Search
        </button>
      </div>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date & Time</th>
            <th>Total Amount</th>
            <th>Payment Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TR-2023-0582</td>
            <td>Jul 12, 2025 14:23</td>
            <td>$1,850.75</td>
            <td>Card</td>
            <td>
              <button className="btn btn-info btn-sm">
                <FaPrint />
              </button>
              <button className="btn btn-success btn-sm">
                <FaSms />
              </button>
            </td>
          </tr>
          <tr>
            <td>TR-2023-0581</td>
            <td>Jul 12, 2025 11:45</td>
            <td>$2,420.50</td>
            <td>Cash</td>
            <td>
              <button className="btn btn-info btn-sm">
                <FaPrint />
              </button>
              <button className="btn btn-success btn-sm">
                <FaSms />
              </button>
            </td>
          </tr>
          <tr>
            <td>TR-2023-0580</td>
            <td>Jul 11, 2025 16:12</td>
            <td>$3,125.25</td>
            <td>Card</td>
            <td>
              <button className="btn btn-info btn-sm">
                <FaPrint />
              </button>
              <button className="btn btn-success btn-sm">
                <FaSms />
              </button>
            </td>
          </tr>
          <tr>
            <td>TR-2023-0579</td>
            <td>Jul 10, 2025 10:33</td>
            <td>$980.30</td>
            <td>Cash & Card</td>
            <td>
              <button className="btn btn-info btn-sm">
                <FaPrint />
              </button>
              <button className="btn btn-success btn-sm">
                <FaSms />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="footer-nav">
        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TransactionHistory;
