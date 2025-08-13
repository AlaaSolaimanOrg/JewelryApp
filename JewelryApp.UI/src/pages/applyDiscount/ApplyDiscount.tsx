import { FaCheck, FaGem, FaRing, FaTag, FaTimes } from "react-icons/fa";
import "./applyDiscount.scss";

const ApplyDiscount = () => {
  return (
    <div className="page-content applyDiscount">
      <h2>
        <FaTag /> Apply Discount
      </h2>
      <p className="subtitle">Adjust pricing for items or entire order</p>

      <div className="cart-container">
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Weight (g)</th>
                <th>Price/Gram</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="item-name">
                  <FaRing className="color-gold" />
                  Diamond Solitaire Ring
                </td>
                <td>
                  <span>125.75</span>
                </td>
                <td>
                  <input
                    type="number"
                    value="440.13"
                    step="0.01"
                    style={{ width: "120px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value="440.13"
                    step="0.01"
                    style={{ width: "120px" }}
                  />
                </td>
              </tr>
              <tr>
                <td className="item-name">
                  <FaGem className="color-gold" />
                  Gold Tennis Bracelet
                </td>
                <td>
                  <span>112.3</span>
                </td>
                <td>
                  <input
                    type="number"
                    value="920.86"
                    step="0.01"
                    style={{ width: "120px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value="920.86"
                    step="0.01"
                    style={{ width: "120px" }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "30px" }}>
            <h3>Order-Level Discount</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Discount Type</label>
                <select>
                  <option>Percentage</option>
                  <option>Fixed Amount</option>
                </select>
              </div>
              <div className="detail-item">
                <label>Discount Value</label>
                <input type="number" value="0" step="0.01" />
              </div>
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <h3>Discount Summary</h3>

          <div className="summary-item">
            <span>Original Total:</span>
            <span>$2,215.17</span>
          </div>
          <div className="summary-item">
            <span>Item Discounts:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-item">
            <span>Order Discount:</span>
            <span>$0.00</span>
          </div>

          <div className="summary-total">
            <span>New Total:</span>
            <span>$2,215.17</span>
          </div>

          <div className="cart-actions">
            <button
              className="btn btn-primary"
              //   onclick="navigatePage('cart-page', 'Cart Summary')"
            >
              <FaCheck />
              Apply Discount
            </button>
            <button
              className="btn btn-secondary"
              //   onclick="navigatePage('cart-page', 'Cart Summary')"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyDiscount;
