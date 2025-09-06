import { FaCalculator, FaSyncAlt, FaTag } from "react-icons/fa";
import "./pricing.scss";

const Pricing = () => {
  return (
    <div id="pricing" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaTag className="icon me-2" />
          <span>Pricing Control</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaSyncAlt className="me-1" /> Apply Prices
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Gold Pricing</h3>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label required">18K Price/Gram ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value="45.75"
              />
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label className="form-label required">21K Price/Gram ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value="52.40"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Pricing Method</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input type="radio" name="pricing-method" defaultChecked /> Manual
              Pricing
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input type="radio" name="pricing-method" /> API Integration
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Price Preview</h3>
          <div>
            <button className="btn-md btn-gray">
              <FaCalculator className="me-1" /> Recalculate
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Weight (g)</th>
                <th>Karat</th>
                <th>Current Price</th>
                <th>New Price</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diamond Engagement Ring</td>
                <td>4.2</td>
                <td>18K</td>
                <td>$1,890</td>
                <td>$1,920</td>
                <td style={{ color: "#28a745" }}>+ $30</td>
              </tr>
              <tr>
                <td>Sapphire Pendant</td>
                <td>7.8</td>
                <td>21K</td>
                <td>$2,450</td>
                <td>$2,480</td>
                <td style={{ color: "#28a745" }}>+ $30</td>
              </tr>
              <tr>
                <td>Gold Bangle Set</td>
                <td>24.5</td>
                <td>22K</td>
                <td>$5,890</td>
                <td>$5,980</td>
                <td style={{ color: "#28a745" }}>+ $90</td>
              </tr>
              <tr>
                <td>Platinum Wedding Band</td>
                <td>5.3</td>
                <td>Platinum</td>
                <td>$1,230</td>
                <td>$1,230</td>
                <td>No change</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
