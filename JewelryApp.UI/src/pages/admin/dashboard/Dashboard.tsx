import CustomTable from "../../../components/Table/CustomTable";
import "./dashboard.scss";

// Import icons from react-icons/fa
import {
  FaHome,
  FaSyncAlt,
  FaShoppingBag,
  FaGem,
  FaUsers,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div id="dashboard" className="page active">
      <div className="page-header">
        <h1 className="page-title">
          <FaHome className="icon me-2" />
          <span>Admin Dashboard</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaSyncAlt className="icon me-1" /> Refresh
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Sales Today</div>
            <div className="kpi-icon">
              <FaShoppingBag className="icon" />
            </div>
          </div>
          <div className="kpi-value">$24,560</div>
          <div className="kpi-trend">
            <FaArrowUp className="icon" /> 12.4% from yesterday
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Stock Value</div>
            <div className="kpi-icon">
              <FaGem className="icon" />
            </div>
          </div>
          <div className="kpi-value">$892,350</div>
          <div className="kpi-trend down">
            <FaArrowDown className="icon" /> 2.1% from last month
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Customers</div>
            <div className="kpi-icon">
              <FaUsers className="icon" />
            </div>
          </div>
          <div className="kpi-value">1,248</div>
          <div className="kpi-trend">
            <FaArrowUp className="icon" /> 5.7% from last week
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Items Sold</div>
            <div className="kpi-icon">
              <FaShoppingCart className="icon" />
            </div>
          </div>
          <div className="kpi-value">142</div>
          <div className="kpi-trend">
            <FaArrowUp className="icon" /> 8.3% from yesterday
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <div className="chart-container">
            <div className="chart-placeholder">
              Sales Trend Chart (Last 30 Days)
            </div>
          </div>
        </div>
        <div className="form-col">
          <div className="chart-container">
            <div className="chart-placeholder">Sales by Karat Distribution</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Selling Products</h3>
          <div>
            <button className="btn-md btn-gray">
              <FaDownload className="icon me-1" /> Export
            </button>
          </div>
        </div>

        <CustomTable />
      </div>
    </div>
  );
};

export default Dashboard;
