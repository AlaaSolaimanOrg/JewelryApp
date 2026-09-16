import { useEffect, useState } from "react";
import { FaCog, FaSave, FaShieldAlt } from "react-icons/fa";
import {
  getSalesPin,
  updateSalesPin,
} from "../../../apis/securitySettings.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./settings.scss";

const Settings = () => {
  const [salesPin, setSalesPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  useEffect(() => {
    const fetchSalesPin = async () => {
      const response = await getSalesPin();
      if (checkRequestSucceeded(response?.statusCode)) {
        setSalesPin(response?.data || "");
      }
    };
    fetchSalesPin();
  }, []);

  const handleSalesPinSave = async () => {
    if (!/^\d{4}$/.test(salesPin)) {
      showError("PIN must be exactly 4 digits.");
      return;
    }
    setSavingPin(true);
    try {
      const response = await updateSalesPin({ pin: salesPin });
      if (checkRequestSucceeded(response?.statusCode)) {
        showSuccess(response?.message || "Sales PIN updated successfully.");
      } else {
        showError(response?.message || "Failed to update sales PIN.");
      }
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <div id="settings" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaCog className="icon" /> <span>Settings</span>
        </h1>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h3>
            <FaShieldAlt /> Security Settings
          </h3>
          <div className="form-group">
            <label className="form-label">POS "View sales" PIN</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              className="form-control"
              placeholder="4-digit PIN"
              value={salesPin}
              onChange={(e) =>
                setSalesPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
            />
          </div>
          <button
            className="btn-md btn-gold"
            onClick={handleSalesPinSave}
            disabled={savingPin}
          >
            <FaSave /> {savingPin ? "Saving..." : "Save PIN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
