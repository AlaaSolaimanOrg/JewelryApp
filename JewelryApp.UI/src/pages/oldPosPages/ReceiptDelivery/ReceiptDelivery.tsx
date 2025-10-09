import {
  FaCheckCircle,
  FaHome,
  FaPaperPlane,
  FaSms,
  FaTimes,
} from "react-icons/fa";
import "./receiptDelivery.scss";
const ReceiptDelivery = () => {
  return (
    <div id="delivery-page" className="page-content">
      <h2>
        <FaSms /> Receipt Delivery
      </h2>
      <p className="subtitle">Send receipt to customer</p>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="payment-card">
          <h3>Send via SMS</h3>
          <div className="payment-input-group">
            <label>Customer Phone Number</label>
            <input type="tel" placeholder="+1 (555) 123-4567" />
          </div>

          <div className="action-buttons" style={{ marginTop: "30px" }}>
            <button className="btn btn-success">
              <FaPaperPlane /> Send SMS Receipt
            </button>
            <button className="btn btn-secondary">
              <FaTimes /> Skip & Finish
            </button>
          </div>
        </div>

        <div
          id="sms-success"
          style={{
            display: "none",
            marginTop: "30px",
            textAlign: "center",
            padding: "25px",
            background: "#e8f5e9",
            borderRadius: "var(--border-radius)",
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: "3rem",
              color: "var(--success)",
              marginBottom: "20px",
            }}
          />

          <h3 style={{ color: "var(--success)", marginBottom: "15px" }}>
            SMS Sent Successfully!
          </h3>
          <p>The receipt has been sent to the customer's phone.</p>

          <button className="btn btn-primary" style={{ marginTop: "20px" }}>
            <FaHome /> Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDelivery;
