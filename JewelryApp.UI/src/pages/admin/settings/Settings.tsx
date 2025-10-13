import {
  FaCog,
  FaCommentAlt,
  FaCreditCard,
  FaGlobe,
  FaMoneyBillWave,
  FaSave,
} from "react-icons/fa";
import "./settings.scss";

const Settings = () => {
  return (
    <div id="settings" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaCog className="icon" /> <span>Global Settings</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaSave /> Save Settings
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h3>
            <FaMoneyBillWave /> Pricing Settings
          </h3>
          <div className="form-group">
            <label className="form-label">Default 18K Price/Gram</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value="45.75"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Default 21K Price/Gram</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value="52.40"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value="8.5"
            />
          </div>
        </div>

        <div className="setting-card">
          <h3>
            <FaCommentAlt /> SMS Settings
          </h3>
          <div className="form-group">
            <label className="form-label">SMS Gateway API Key</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter API key"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sender ID</label>
            <input type="text" className="form-control" value="GemLuxe" />
          </div>
          <div className="form-group">
            <label className="form-label">SMS Templates</label>
            <select className="form-control">
              <option>Default Template</option>
              <option>Promotional Template</option>
              <option>Appointment Reminder</option>
            </select>
          </div>
        </div>

        <div className="setting-card">
          <h3>
            <FaCreditCard /> Payment Settings
          </h3>
          <div className="form-group">
            <label className="form-label">Payment Gateway</label>
            <select className="form-control">
              <option>Moneris</option>
              <option>Stripe</option>
              <option>PayPal</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter API key"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Transaction Fee (%)</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value="2.9"
            />
          </div>
        </div>

        <div className="setting-card">
          <h3>
            <FaGlobe /> General Settings
          </h3>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input
              type="text"
              className="form-control"
              value="GemLuxe Jewelers"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date Format</label>
            <select className="form-control">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Time Format</label>
            <select className="form-control">
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
