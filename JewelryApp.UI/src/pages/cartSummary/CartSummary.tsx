import { Link } from "react-router-dom";
import "./cartSummary.scss";
import {
  FaCreditCard,
  FaGem,
  FaPlus,
  FaRing,
  FaShoppingCart,
  FaTag,
  FaTimes,
} from "react-icons/fa";

const CartSummary = () => {
  return (
    <div className="cartSummary page-content">
      <h2 className="title">
        <FaShoppingCart /> Cart Summary
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
                  <FaRing />
                  Diamond Solitaire Ring
                </td>
                <td>21K</td>
                <td>3.5g</td>
                <td>$125.75</td>
                <td>$440.13</td>
                <td className="item-actions">
                  <button>
                    <FaTimes />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="item-name">
                  <FaGem />
                  Gold Tennis Bracelet
                </td>
                <td>18K</td>
                <td>8.2g</td>
                <td>$112.30</td>
                <td>$920.86</td>
                <td className="item-actions">
                  <button>
                    <FaTimes />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="item-name">
                  <FaGem />
                  Ruby Heart Pendant
                </td>
                <td>24K</td>
                <td>5.1g</td>
                <td>$142.90</td>
                <td>$728.79</td>
                <td className="item-actions">
                  <button>
                    <FaTimes />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <Link to={"/applyDiscount"} className="text-decoration-none">
            <button
              className="btn btn-secondary"
            >
              <FaTag /> Apply Discount
            </button>
          </Link>
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
            <Link to={"/payment"} className="text-decoration-none">
              <button
                className="btn btn-primary w-100"
              >
                <FaCreditCard /> Proceed to Payment
              </button>
            </Link>
            <button className="btn btn-secondary">
              <FaTimes /> Cancel Sale
            </button>
            <Link to={"/productLookUp"} className="text-decoration-none">
              <button
                className="btn btn-secondary w-100"
              >
                <FaPlus /> Add More Items
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
