import { Link } from "react-router-dom";
import "./receipt.scss";

const Receipt = () => {
  return (
    <div id="receipt-page" className="page-content">
      <h2>
        <i className="fas fa-receipt"></i> Receipt Preview
      </h2>
      <p className="subtitle">Review receipt before finalizing</p>

      <div className="receipt-container">
        <div className="receipt-header">
          <div className="receipt-title">GoldCraft Jewelers</div>
          <div className="receipt-subtitle">
            123 Luxury Avenue, Diamond District
          </div>
          <div className="receipt-subtitle">Phone: (555) 123-4567</div>
        </div>

        <div className="receipt-details">
          <div>
            <div>
              <strong>Transaction ID:</strong> TR-2023-0583
            </div>
            <div>
              <strong>Date:</strong> July 13, 2025
            </div>
            <div>
              <strong>Time:</strong> 10:45:23 AM
            </div>
          </div>
          <div>
            <div>
              <strong>Staff:</strong> Sarah Johnson
            </div>
            <div>
              <strong>Customer:</strong> Walk-in
            </div>
            <div>
              <strong>Payment Method:</strong> Cash & Card
            </div>
          </div>
        </div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Karat</th>
              <th>Weight</th>
              <th>Price/Gram</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Diamond Solitaire Ring</td>
              <td>21K</td>
              <td>3.5g</td>
              <td>$125.75</td>
              <td>$440.13</td>
            </tr>
            <tr>
              <td>Gold Tennis Bracelet</td>
              <td>18K</td>
              <td>8.2g</td>
              <td>$112.30</td>
              <td>$920.86</td>
            </tr>
            <tr>
              <td>Ruby Heart Pendant</td>
              <td>24K</td>
              <td>5.1g</td>
              <td>$142.90</td>
              <td>$728.79</td>
            </tr>
          </tbody>
        </table>

        <div className="receipt-totals">
          <div className="receipt-total">
            <div className="total-label">Subtotal</div>
            <div className="total-value">$2,089.78</div>
          </div>
          <div className="receipt-total">
            <div className="total-label">Total</div>
            <div className="total-value">$2,215.17</div>
          </div>
        </div>

        <div className="payment-breakdown">
          <h4>Payment Breakdown</h4>
          <div className="summary-item">
            <span>Cash Payment:</span>
            <span>$200.00</span>
          </div>
          <div className="summary-item">
            <span>Card Payment:</span>
            <span>$2,015.17</span>
          </div>
        </div>

        <div className="receipt-actions">
          <Link to={"/applyDiscount"} className="text-decoration-none">
            <button
              className="btn btn-info"
              //   onclick="navigatePage('delivery-page', 'Receipt Delivery')"
            >
              <i className="fas fa-sms"></i> Send SMS
            </button>
          </Link>
          <button className="btn btn-primary">
            <i className="fas fa-print"></i> Print Receipt
          </button>
          <Link to={"/applyDiscount"} className="text-decoration-none">
            <button
              className="btn btn-success"
              //   onclick="navigatePage('home-page', 'POS Dashboard')"
            >
              <i className="fas fa-check"></i> Complete Sale
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
