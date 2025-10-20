import "./exportData.scss";
import {
  FaFileExport,
  FaBox,
  FaChartLine,
  FaUsers,
  FaDownload,
} from "react-icons/fa";

const ExportData = () => {
  return (
    <div id="export-data" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaFileExport className="icon" /> <span>Export Data</span>
        </h1>
      </div>

      <div className="export-options">
        <div className="export-card">
          <h3>
            <FaBox /> Export Inventory
          </h3>
          <div className="form-group">
            <label className="form-label">Scope</label>
            <select className="form-control">
              <option>All Inventory</option>
              <option>Filtered Inventory</option>
              <option>Low Stock Items</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Format</label>
            <select className="form-control">
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Options</label>
            <div>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Include Images
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Include History
              </label>
            </div>
          </div>
          <button className="btn-md btn-gold" style={{ width: "100%" }}>
            <FaDownload /> Export Inventory
          </button>
        </div>

        <div className="export-card">
          <h3>
            <FaChartLine /> Export Sales Reports
          </h3>
          <div className="form-group">
            <label className="form-label">Date Range</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                className="form-control"
                defaultValue="2023-10-01"
              />
              <input
                type="date"
                className="form-control"
                defaultValue="2023-10-31"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Format</label>
            <select className="form-control">
              <option>CSV</option>
              <option>Excel</option>
              <option>PDF</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Detail Level</label>
            <select className="form-control">
              <option>Summary Only</option>
              <option>Detailed Report</option>
            </select>
          </div>
          <button className="btn-md btn-gold" style={{ width: "100%" }}>
            <FaDownload /> Export Sales
          </button>
        </div>

        <div className="export-card">
          <h3>
            <FaUsers /> Export Customers
          </h3>
          <div className="form-group">
            <label className="form-label">Scope</label>
            <select className="form-control">
              <option>All Customers</option>
              <option>VIP Customers</option>
              <option>Recent Customers</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Format</label>
            <select className="form-control">
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Include</label>
            <div>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Purchase History
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Contact Info
              </label>
            </div>
          </div>
          <button className="btn-md btn-gold" style={{ width: "100%" }}>
            <FaDownload /> Export Customers
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
