import { useState } from "react";
import AddCustomerModal from "../../../components/AddCustomerModal/AddCustomerModal";
import {
  FaGem,
  FaBarcode,
  FaUser,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaShoppingCart,
  FaPlusCircle,
  FaRing,
  FaHeart,
  FaTag,
  FaStickyNote,
  FaCreditCard,
  FaTimes,
} from "react-icons/fa";
import "./mainPosPage.scss";

const MainPosPage = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  return (
    <div id="mainPosPage">
      <div className="container">
        <header className="header">
          <div className="logo">
            <FaGem />
            GoldCraft POS
          </div>
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search customer..."
            />
            <button
              className="add-customer-btn"
              onClick={() => {
                setShowAddCustomerModal(true);
              }}
            >
              Add New Customer
            </button>
          </div>
          <button className="scan-btn">
            <FaBarcode style={{ marginRight: "8px" }} /> Scan Product
          </button>
        </header>

        <div className="customer-info" id="customerInfo">
          <h3 className="customer-title">
            <FaUser />
            Customer Information
          </h3>
          <div className="customer-details">
            <div className="customer-detail">
              <FaUserCircle
                style={{ marginRight: "8px", color: "var(--primary)" }}
              />
              <span id="customerName">John Doe</span>
            </div>
            <div className="customer-detail">
              <FaEnvelope
                style={{ marginRight: "8px", color: "var(--primary)" }}
              />
              <span id="customerEmail">john.doe@example.com</span>
            </div>
            <div className="customer-detail">
              <FaPhone
                style={{ marginRight: "8px", color: "var(--primary)" }}
              />
              <span id="customerPhone">(555) 123-4567</span>
            </div>
            <div className="customer-detail">
              <FaBirthdayCake
                style={{ marginRight: "8px", color: "var(--primary)" }}
              />
              <span id="customerBirthday">March 15, 1985</span>
            </div>
          </div>
        </div>

        <section className="products-section">
          <h2 className="section-title">
            <FaShoppingCart className="icon" />
            Cart Summary
          </h2>
          <button className="manual-entry-btn" id="manualEntryBtn">
            <FaPlusCircle style={{ marginRight: "8px" }} /> Manual Entry
          </button>
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Kraft</th>
                <th>Weight</th>
                <th>Price/Gram</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="productsTableBody">
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="product-image">
                      <FaRing />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      Diamond Solitaire Ring
                    </div>
                  </div>
                </td>
                <td>21K</td>
                <td>
                  <input type="text" className="weight-input" value="3.5g" />
                </td>
                <td>
                  <input type="text" className="price-input" value="$125.75" />
                </td>
                <td>$125.75</td>
                <td>$440.13</td>
                <td>
                  <button className="remove-btn">
                    <FaTimes />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="product-image">
                      <FaRing />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      Gold Tennis Bracelet
                    </div>
                  </div>
                </td>
                <td>18K</td>
                <td>
                  <input type="text" className="weight-input" value="8.2g" />
                </td>
                <td>
                  <input type="text" className="price-input" value="$112.30" />
                </td>
                <td>$112.30</td>
                <td>$920.68</td>
                <td>
                  <button className="remove-btn">
                    <FaTimes />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="product-image">
                      <FaHeart />
                    </div>
                    <div style={{ marginLeft: "10px" }}>Ruby Heart Pendant</div>
                  </div>
                </td>
                <td>24K</td>
                <td>
                  <input type="text" className="weight-input" value="5.1g" />
                </td>
                <td>
                  <input type="text" className="price-input" value="$142.90" />
                </td>
                <td>$142.90</td>
                <td>$728.79</td>
                <td>
                  <button className="remove-btn">
                    <FaTimes />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="discount-section">
          <h2 className="section-title">
            <FaTag className="icon" />
            Apply Discount
          </h2>
          <div className="discount-inputs">
            <input
              type="text"
              className="discount-amount"
              placeholder="Discount amount"
            />
            <select className="discount-type">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Value ($)</option>
            </select>
          </div>
        </section>

        <section className="notes-section">
          <h2 className="section-title">
            <FaStickyNote className="icon" />
            Notes / Remarks
          </h2>
          <textarea
            className="notes-textarea"
            placeholder="Add any notes or remarks here..."
          />
        </section>

        <section className="payment-section">
          <h2 className="section-title">
            <FaCreditCard className="icon" />
            Payment
          </h2>
          <div className="payment-inputs">
            <div className="payment-input-group">
              <label>Cash Amount</label>
              <input
                type="text"
                className="payment-input"
                placeholder="$0.00"
              />
            </div>
            <div className="payment-input-group">
              <label>Card Amount</label>
              <input
                type="text"
                className="payment-input"
                placeholder="$0.00"
              />
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>$2,089.78</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>$125.39</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>$2,215.17</span>
            </div>
          </div>

          <div className="footer-buttons">
            <button className="save-btn">Save Sale</button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </section>
      </div>
      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false);
        }}
      />
    </div>
  );
};

export default MainPosPage;
