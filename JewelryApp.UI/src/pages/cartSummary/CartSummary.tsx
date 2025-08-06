import { Link } from "react-router-dom";
import "./cartSummary.scss";

const CartSummary = () => {
  return (
    <div className="page-content">
      <h2>
        <i className="fas fa-shopping-cart"></i> Cart Summary
      </h2>
      <p className="subtitle">Review items before payment</p>

      <div className="cart-container">
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Karat</th>
                <th>Weight</th>
                <th>Price/Gram</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="item-name">
                  <i className="fas fa-ring gem-icon"></i>
                  Diamond Solitaire Ring
                </td>
                <td>21K</td>
                <td>3.5g</td>
                <td>$125.75</td>
                <td>$440.13</td>
                <td className="item-actions">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="item-name">
                  <i className="fas fa-gem gem-icon"></i>
                  Gold Tennis Bracelet
                </td>
                <td>18K</td>
                <td>8.2g</td>
                <td>$112.30</td>
                <td>$920.86</td>
                <td className="item-actions">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="item-name">
                  <i className="fas fa-heart gem-icon"></i>
                  Ruby Heart Pendant
                </td>
                <td>24K</td>
                <td>5.1g</td>
                <td>$142.90</td>
                <td>$728.79</td>
                <td className="item-actions">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            className="btn btn-secondary"
            onclick="navigatePage('discount-page', 'Apply Discount')"
          >
            <i className="fas fa-tag"></i> Apply Discount
          </button>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-item">
            <span>Subtotal:</span>
            <span>$2,089.78</span>
          </div>
          <div className="summary-item">
            <span>Discount:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>$125.39</span>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>$2,215.17</span>
          </div>

          <div className="cart-actions">
            <Link to={"/productLookUp"}>
              <button
                className="btn btn-primary"
                // onclick="navigatePage('payment-page', 'Payment')"
              >
                <i className="fas fa-credit-card"></i> Proceed to Payment
              </button>
            </Link>
            <button className="btn btn-secondary">
              <i className="fas fa-times"></i> Cancel Sale
            </button>
            <Link to={"/productLookUp"}>
              <button
                className="btn btn-secondary"
                // onclick="navigatePage('scan-page', 'Product Lookup')"
              >
                <i className="fas fa-plus"></i> Add More Items
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
