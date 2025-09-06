import { FaCalculator, FaSyncAlt, FaTag } from "react-icons/fa";
import "./pricing.scss";
import { Row } from "react-bootstrap";

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

      <Row>
        <div className="card goldingPriceCard">
          <div className="card-header">
            <h3 className="card-title">Gold Pricing</h3>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">
                  18K Price/Gram ($)
                </label>
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
                <label className="form-label required">
                  21K Price/Gram ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value="52.40"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">
                  21K Price/Gram ($)
                </label>
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
                <input type="radio" name="pricing-method" defaultChecked />{" "}
                Manual Pricing
              </label>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input type="radio" name="pricing-method" /> API Integration
              </label>
            </div>
          </div>
        </div>
        <div className="card goldingPriceCard">
          <div className="card-header">
            <h3 className="card-title">Gold Pricing</h3>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">
                  18K Price/Gram ($)
                </label>
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
                <label className="form-label required">
                  21K Price/Gram ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value="52.40"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">
                  21K Price/Gram ($)
                </label>
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
                <input type="radio" name="pricing-method" defaultChecked />{" "}
                Manual Pricing
              </label>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input type="radio" name="pricing-method" /> API Integration
              </label>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default Pricing;
