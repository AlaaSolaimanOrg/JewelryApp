import { FaArrowLeft, FaCartPlus, FaPen } from "react-icons/fa";
import "./manualItemEntry.scss";

const ManualItemEntry = () => {
  return (
    <div className="page-content manualItemEntry">
      <h2>
        <FaPen /> Manual Item Entry
      </h2>
      <p className="subtitle">Enter jewelry details manually</p>

      <div className="product-details">
        <div className="detail-row">
          <div className="detail-item">
            <label>Product Name</label>
            <input type="text" placeholder="Enter product name" />
          </div>
          <div className="detail-item">
            <label>Karat</label>
            <select>
              <option>Select Karat</option>
              <option>18K</option>
              <option>21K</option>
              <option>24K</option>
            </select>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <label>Weight (grams)</label>
            <input type="number" value="" step="0.01" placeholder="0.00" />
          </div>
          <div className="detail-item">
            <label>Price per gram</label>
            <input type="number" value="125.75" step="0.01" />
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <label>Quantity</label>
            <input type="number" value="1" />
          </div>
          <div className="detail-item">
            <label>Final Price (override)</label>
            <input
              type="number"
              value=""
              step="0.01"
              placeholder="Leave blank for auto-calculate"
            />
          </div>
        </div>
      </div>

      <div className="price-display">Calculated Price: $0.00</div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          // onclick="navigatePage('cart-page', 'Cart Summary')"
        >
          <FaCartPlus /> Add to Cart
        </button>

        <button
          className="btn btn-secondary"
          // onclick="navigatePage('scan-page', 'Product Lookup')"
        >
          <FaArrowLeft /> Back to Search
        </button>
      </div>
    </div>
  );
};

export default ManualItemEntry;
