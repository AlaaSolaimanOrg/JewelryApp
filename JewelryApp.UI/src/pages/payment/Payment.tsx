import { Link } from "react-router-dom";
import "./payment.scss";
import {
  FaArrowLeft,
  FaCheck,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBill,
} from "react-icons/fa";

const Payment = () => {
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
              <FaMoneyBill />
              Cash Payment
            </h3>
            <div className="payment-input-group">
              <label>Cash Amount</label>
              <input type="number" value="0.00" step="0.01" />
            </div>
            <button className="btn btn-success">
              <FaCheck /> Apply Cash Payment
            </button>
          </div>

          <div className="payment-card">
            <h3>
              <FaCreditCard />
              Card Payment
            </h3>
            <div className="payment-input-group">
              <label>Card Amount</label>
              <input type="number" value="0.00" step="0.01" />
            </div>
            <button className="btn btn-info text-white">
              <FaCreditCard /> Process with Moneris
            </button>
          </div>

          <div className="payment-card">
            <h3>
              <FaCreditCard />
              Additional Card
            </h3>
            <div className="payment-input-group">
              <label>Card Amount</label>
              <input type="number" value="0.00" step="0.01" />
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
            <span>$2,215.17</span>
          </div>

          <div className="applied-payments" style={{ margin: "25px 0" }}>
            <div className="summary-item">
              <span>Cash Payment:</span>
              <span>$200.00</span>
            </div>
            <div className="summary-item">
              <span>Card Payment:</span>
              <span>$500.00</span>
            </div>
          </div>

          <div className="balance-display">Balance Due: $1,515.17</div>

          <div className="cart-actions">
            <Link to={"/payment"} className="text-decoration-none">
              <button
                className="btn btn-primary w-100"
                //   onclick="navigatePage('receipt-page', 'Receipt Preview')"
              >
                <FaCheckCircle /> Confirm Payment
              </button>
            </Link>

            <Link to={"/payment"} className="text-decoration-none">
              <button
                className="btn btn-secondary w-100 mt-3"
                //   onclick="navigatePage('cart-page', 'Cart Summary')"
              >
                <FaArrowLeft />
                Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
