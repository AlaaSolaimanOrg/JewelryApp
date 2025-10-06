import React, { useState, type JSX } from "react";
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
import ScanModal from "../../../components/ScanModal/ScanModal";

const initialCustomer = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  birthday: "March 15, 1985",
};

type Product = {
  name: string;
  icon: JSX.Element;
  kraft: string;
  weight: string;
  pricePerGram: string;
  unitPrice: string;
  subtotal: string;
  manual?: boolean;
};

const initialProducts: Product[] = [
  {
    name: "Diamond Solitaire Ring",
    icon: <FaRing />,
    kraft: "21K",
    weight: "3.5",
    pricePerGram: "125.75",
    unitPrice: "125.75",
    subtotal: "440.13",
  },
  {
    name: "Gold Tennis Bracelet",
    icon: <FaRing />,
    kraft: "18K",
    weight: "8.2",
    pricePerGram: "112.30",
    unitPrice: "112.30",
    subtotal: "920.68",
  },
  {
    name: "Ruby Heart Pendant",
    icon: <FaHeart />,
    kraft: "24K",
    weight: "5.1",
    pricePerGram: "142.90",
    unitPrice: "142.90",
    subtotal: "728.79",
  },
];

const MainPosPage = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [customer, setCustomer] = useState(initialCustomer);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [notes, setNotes] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");

  // Calculate totals
  const subtotal = products.reduce((sum, p) => sum + parseFloat(p.subtotal), 0);
  const discount = discountAmount
    ? discountType === "percentage"
      ? (subtotal * parseFloat(discountAmount)) / 100
      : parseFloat(discountAmount)
    : 0;
  const tax = parseFloat((subtotal * 0.06).toFixed(2));
  const total = subtotal - discount + tax;

  // Search input enter
  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      // Simulate finding a customer
      setCustomer({
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(555) 987-6543",
        birthday: "August 22, 1990",
      });
      setCustomerInfoActive(true);
    }
  };

  // Manual entry
  const handleManualEntry = () => {
    setProducts([
      ...products,
      {
        name: "",
        icon: <FaRing />,
        kraft: "14K",
        weight: "",
        pricePerGram: "",
        unitPrice: "",
        subtotal: "",
        manual: true,
      },
    ]);
  };

  // Remove product
  const handleRemoveProduct = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Update manual product
  const handleManualProductChange = (idx, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      // Calculate subtotal if possible
      if (
        field === "weight" ||
        field === "pricePerGram" ||
        field === "unitPrice"
      ) {
        const w = parseFloat(updated[idx].weight) || 0;
        const ppg = parseFloat(updated[idx].pricePerGram) || 0;
        updated[idx].unitPrice = ppg.toFixed(2);
        updated[idx].subtotal = (w * ppg).toFixed(2);
      }
      return updated;
    });
  };

  return (
    <div id="mainPosPage" className="page-content">
      <header className="header">
        <div className="logo">
          <FaGem /> GoldCraft POS
        </div>
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder={`Search customer by ...`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={handleSearchKeyUp}
          />
          <button
            className="add-customer-btn"
            onClick={() => setShowAddCustomerModal(true)}
          >
            Add New Customer
          </button>
        </div>
        <button
          className="scan-btn"
          onClick={() => {
            setShowScanModal(true);
          }}
        >
          <FaBarcode style={{ marginRight: "8px" }} /> Scan Product
        </button>
      </header>

      <div
        className={`customer-info${customerInfoActive ? " active" : ""}`}
        id="customerInfo"
      >
        <h3 className="customer-title">
          <FaUser /> Customer Information
        </h3>
        <div className="customer-details">
          <div className="customer-detail">
            <FaUserCircle
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerName">{customer.name}</span>
          </div>
          <div className="customer-detail">
            <FaEnvelope
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerEmail">{customer.email}</span>
          </div>
          <div className="customer-detail">
            <FaPhone
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerPhone">{customer.phone}</span>
          </div>
          <div className="customer-detail">
            <FaBirthdayCake
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerBirthday">{customer.birthday}</span>
          </div>
        </div>
      </div>

      <section className="products-section">
        <h2 className="section-title">
          <FaShoppingCart className="icon" /> Cart Summary
        </h2>
        <button
          className="manual-entry-btn"
          id="manualEntryBtn"
          onClick={handleManualEntry}
        >
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
            {products.map((p, idx) => (
              <tr key={idx} className={p.manual ? "manual-row" : ""}>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="product-image">{p.icon}</div>
                    <div style={{ marginLeft: "10px" }}>
                      {p.manual ? (
                        <input
                          type="text"
                          className="product-name-input"
                          placeholder="Product Name"
                          value={p.name}
                          onChange={(e) =>
                            handleManualProductChange(
                              idx,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {p.manual ? (
                    <select
                      value={p.kraft}
                      onChange={(e) =>
                        handleManualProductChange(idx, "kraft", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    >
                      <option>14K</option>
                      <option>18K</option>
                      <option>21K</option>
                      <option>24K</option>
                    </select>
                  ) : (
                    p.kraft
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    className="weight-input"
                    placeholder={p.manual ? "0.0g" : ""}
                    value={p.weight}
                    onChange={
                      p.manual
                        ? (e) =>
                            handleManualProductChange(
                              idx,
                              "weight",
                              e.target.value
                            )
                        : undefined
                    }
                    readOnly={!p.manual}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="price-input"
                    placeholder={p.manual ? "$0.00" : ""}
                    value={p.pricePerGram}
                    onChange={
                      p.manual
                        ? (e) =>
                            handleManualProductChange(
                              idx,
                              "pricePerGram",
                              e.target.value
                            )
                        : undefined
                    }
                    readOnly={!p.manual}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="price-input"
                    placeholder={p.manual ? "$0.00" : ""}
                    value={p.unitPrice}
                    onChange={
                      p.manual
                        ? (e) =>
                            handleManualProductChange(
                              idx,
                              "unitPrice",
                              e.target.value
                            )
                        : undefined
                    }
                    readOnly={!p.manual}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="subtotal-input"
                    placeholder={p.manual ? "$0.00" : ""}
                    value={p.subtotal}
                    readOnly
                  />
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveProduct(idx)}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="discount-section">
        <h2 className="section-title">
          <FaTag className="icon" /> Apply Discount
        </h2>
        <div className="discount-inputs">
          <input
            type="text"
            className="discount-amount"
            placeholder="Discount amount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
          />
          <select
            className="discount-type"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Value ($)</option>
          </select>
        </div>
      </section>

      <section className="notes-section">
        <h2 className="section-title">
          <FaStickyNote className="icon" /> Notes / Remarks
        </h2>
        <textarea
          className="notes-textarea"
          placeholder="Add any notes or remarks here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      <section className="payment-section">
        <h2 className="section-title">
          <FaCreditCard className="icon" /> Payment
        </h2>
        <div className="payment-inputs">
          <div className="payment-input-group">
            <label>Cash Amount</label>
            <input
              type="text"
              className="payment-input"
              placeholder="$0.00"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
            />
          </div>
          <div className="payment-input-group">
            <label>Card Amount</label>
            <input
              type="text"
              className="payment-input"
              placeholder="$0.00"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Discount:</span>
            <span>${discount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="footer-buttons">
          <button className="save-btn">Save Sale</button>
          <button className="cancel-btn">Cancel</button>
        </div>
      </section>

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
      />
      <ScanModal show={showScanModal} onClose={() => setShowScanModal(false)} />
    </div>
  );
};

export default MainPosPage;
