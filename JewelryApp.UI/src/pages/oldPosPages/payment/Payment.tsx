import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./payment.scss";
import {
  FaArrowLeft,
  FaCheck,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBill,
} from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { total = 0 } = location.state || {};

  // Track entered amounts
  const [cashAmount, setCashAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [extraCardAmount, setExtraCardAmount] = useState(0);

  const appliedPayments = [
    { type: "Cash", amount: cashAmount, alwaysShow: true },
    { type: "Card", amount: cardAmount, alwaysShow: true },
    { type: "Additional Card", amount: extraCardAmount, alwaysShow: false },
  ];

  const totalPaid = appliedPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = total - totalPaid;

  return (
    <div id="payment-page" className="page-content">
      <h2>
        <FaCreditCard /> Payment
      </h2>
      <p className="subtitle">Process payment for the order</p>

      <div className="payment-container">
        <div className="payment-methods">
          <div className="payment-card">
            <h3>
              <FaMoneyBill /> Cash Payment
            </h3>
            <div className="payment-input-group">
              <label>Cash Amount</label>
              <input
                type="number"
                step="0.01"
                value={cashAmount}
                onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <button className="btn btn-success">
              <FaCheck /> Apply Cash Payment
            </button>
          </div>

          <div className="payment-card">
            <h3>
              <FaCreditCard /> Card Payment
            </h3>
            <div className="payment-input-group">
              <label>Card Amount</label>
              <input
                type="number"
                step="0.01"
                value={cardAmount}
                onChange={(e) => setCardAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <button className="btn btn-info text-white">
              <FaCreditCard /> Process with Moneris
            </button>
          </div>

          <div className="payment-card">
            <h3>
              <FaCreditCard /> Additional Card
            </h3>
            <div className="payment-input-group">
              <label>Card Amount</label>
              <input
                type="number"
                step="0.01"
                value={extraCardAmount}
                onChange={(e) =>
                  setExtraCardAmount(parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <button className="btn btn-info text-white">
              <FaCreditCard /> Add Card Payment
            </button>
          </div>
        </div>

        <div className="payment-summary">
          <h3>Payment Summary</h3>

          <div className="summary-item">
            <span>Order Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="applied-payments" style={{ margin: "25px 0" }}>
            {appliedPayments.map((p, i) => {
              if (p.alwaysShow || p.amount > 0) {
                return (
                  <div key={i} className="summary-item">
                    <span>{p.type} Payment:</span>
                    <span>${p.amount.toFixed(2)}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="balance-display">
            Balance Due: ${balanceDue.toFixed(2)}
          </div>

          <div className="cart-actions">
            <button
              className="btn btn-primary w-100"
              disabled={balanceDue > 0}
              onClick={() => navigate("/receipt")}
            >
              <FaCheckCircle /> Confirm Payment
            </button>

            <Link to={"/cartSummary"} className="text-decoration-none">
              <button className="btn btn-secondary w-100">
                <FaArrowLeft /> Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
