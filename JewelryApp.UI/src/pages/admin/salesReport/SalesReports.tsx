import { FaChartLine, FaDownload, FaFilter } from "react-icons/fa";
import "./salesReports.scss";

const SalesReports = () => {
  return (
    <div id="sales-reports" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaChartLine className="icon me-2" />
          <span>Sales Reports</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaDownload className="me-1" /> Export Report
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Report Filters</h3>
        </div>

        <div className="form-row">
          <div className="form-col">
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
          </div>
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Karat</label>
              <select className="form-control">
                <option>All Karats</option>
                <option>18K</option>
                <option>21K</option>
                <option>22K</option>
                <option>Platinum</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Product Category</label>
              <select className="form-control">
                <option>All Categories</option>
                <option>Rings</option>
                <option>Necklaces</option>
                <option>Earrings</option>
                <option>Bangles</option>
              </select>
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-control">
                <option>All Methods</option>
                <option>Credit Card</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "20px" }}>
          <button className="btn-md btn-gold">
            <FaFilter className="me-1" /> Apply Filters
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sales Overview</h3>
        </div>

        <div className="chart-container">
          <div className="chart-placeholder">
            Monthly Sales Performance Chart
          </div>
        </div>

        <div className="table-container" style={{ marginTop: "25px" }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oct 28, 2023</td>
                <td>#ORD-1024</td>
                <td>Sarah Johnson</td>
                <td>$1,890</td>
                <td>Credit Card</td>
                <td>
                  <span className="tag tag-new">Completed</span>
                </td>
              </tr>
              <tr>
                <td>Oct 27, 2023</td>
                <td>#ORD-1023</td>
                <td>Michael Chen</td>
                <td>$2,450</td>
                <td>Bank Transfer</td>
                <td>
                  <span className="tag tag-new">Completed</span>
                </td>
              </tr>
              <tr>
                <td>Oct 25, 2023</td>
                <td>#ORD-1021</td>
                <td>Emma Rodriguez</td>
                <td>$5,890</td>
                <td>Cash</td>
                <td>
                  <span className="tag tag-premium">Delivered</span>
                </td>
              </tr>
              <tr>
                <td>Oct 24, 2023</td>
                <td>#ORD-1020</td>
                <td>David Wilson</td>
                <td>$1,230</td>
                <td>Credit Card</td>
                <td>
                  <span className="tag tag-featured">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;
