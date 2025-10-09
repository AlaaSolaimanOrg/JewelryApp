import { useState, type JSX } from "react";
import {
  FaBarcode,
  FaBirthdayCake,
  FaCreditCard,
  FaEnvelope,
  FaGem,
  FaPhone,
  FaPlusCircle,
  FaRing,
  FaShoppingCart,
  FaStickyNote,
  FaTag,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import AddCustomerModal from "../../../components/AddCustomerModal/AddCustomerModal";
import ScanModal from "../../../components/ScanModal/ScanModal";
import "./posSale.scss";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import { API_URL } from "../../../config/config";

const initialCustomer = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  birthday: "March 15, 1985",
};

export interface Product {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  karatType?: KaratType;
  weight: number;
  category: ProductCategory;
  productType: ProductType;
  description: string;
  pricePerGram: number;
  price: number;
  images: { imageUrl: string }[];
  manual: boolean;
}

// const initialProducts: Product[] = [
//   {
//     name: "Diamond Solitaire Ring",
//     icon: <FaRing />,
//     karatType: "21K",
//     weight: "3.5",
//     pricePerGram: "125.75",
//     subtotal: "440.13",
//   },
//   {
//     name: "Gold Tennis Bracelet",
//     icon: <FaRing />,
//     karatType: "18K",
//     weight: "8.2",
//     pricePerGram: "112.30",
//     subtotal: "920.68",
//   },
//   {
//     name: "Ruby Heart Pendant",
//     icon: <FaHeart />,
//     karatType: "24K",
//     weight: "5.1",
//     pricePerGram: "142.90",
//     subtotal: "728.79",
//   },
// ];

const MainPosPage = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [customer, setCustomer] = useState(initialCustomer);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [notes, setNotes] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");

  console.log("products", products);
  // Calculate totals
  const subtotal = products?.reduce(
    (sum, product) => sum + parseFloat(product.subtotal),
    0
  );
  const discount = discountAmount
    ? discountType === "percentage"
      ? (subtotal * parseFloat(discountAmount)) / 100
      : parseFloat(discountAmount)
    : 0;
  const tax = parseFloat((subtotal * 0.06).toFixed(4));
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
        images: [],
        karatType: KaratType.Karat18,
        weight: 0,
        pricePerGram: 0,
        manual: true,
        id: "",
        sku: "",
        quantity: 0,
        category: ProductCategory.Necklaces,
        productType: ProductType.Gold,
        description: "",
        price: 0,
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
      let val = value;
      // Only allow up to 4 digits after decimal
      if (field === "weight" || field === "pricePerGram") {
        // Remove non-numeric except dot
        val = val.replace(/[^\d.]/g, "");
        // Limit to one dot
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        // Limit decimal places
        if (parts[1]) val = parts[0] + "." + parts[1].slice(0, 4);
        // Prevent input if value exceeds max
        if (parseFloat(val) > 9999.9999) return prev;
      }
      updated[idx][field] = val;
      // Calculate subtotal if possible
      if (field === "weight" || field === "pricePerGram") {
        const w = parseFloat(updated[idx].weight?.toString() ?? "0") || 0;
        const ppg =
          parseFloat(updated[idx].pricePerGram?.toString() ?? "0") || 0;
        let subtotal = w * ppg;
        // Show up to 4 decimals, but no trailing zeroes
        updated[idx].subtotal =
          subtotal % 1 === 0
            ? subtotal.toString()
            : subtotal
                .toFixed(4)
                .replace(/\.?(0{1,4})$/, "")
                .replace(/(\.\d{1,4})\d*$/, "$1");
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

        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>karat</th>
              <th>Weight</th>
              <th>Price/Gram</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="productsTableBody">
            {products?.map((product, idx) => (
              <tr key={idx} className={product.manual ? "manual-row" : ""}>
                {/* ...existing code for table row... */}
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {!product.manual && (
                      <img
                        className="product-image"
                        src={`${API_URL}${product.images[0]?.imageUrl}`}
                        alt=""
                      />
                    )}
                    <div style={{ marginLeft: "10px" }}>
                      {product.manual ? (
                        <input
                          type="text"
                          className="product-name-input"
                          placeholder="Product Name"
                          value={product.name}
                          onChange={(e) =>
                            handleManualProductChange(
                              idx,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        product.name
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {product.manual ? (
                    <select
                      value={product.karatType}
                      onChange={(e) =>
                        handleManualProductChange(
                          idx,
                          "karatType",
                          e.target.value
                        )
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
                    product.karatType
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    className="weight-input"
                    placeholder={product.manual ? "0.0g" : ""}
                    value={product.weight}
                    onChange={(e) =>
                      handleManualProductChange(idx, "weight", e.target.value)
                    }
                    maxLength={10}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="price-input"
                    placeholder={product.manual ? "$0.00" : ""}
                    value={product.pricePerGram}
                    onChange={(e) =>
                      handleManualProductChange(
                        idx,
                        "pricePerGram",
                        e.target.value
                      )
                    }
                    maxLength={10}
                  />
                </td>

                <td>
                  <span>
                    {(() => {
                      const subtotal =
                        parseFloat(product.pricePerGram?.toString() ?? "0") *
                        parseFloat(product.weight?.toString() ?? "0");
                      if (subtotal % 1 === 0) return subtotal;
                      return subtotal
                        .toFixed(4)
                        .replace(/\.?(0{1,4})$/, "")
                        .replace(/(\.\d{1,4})\d*$/, "$1");
                    })()}
                  </span>
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
          <tfoot>
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: "center", padding: "12px 0" }}
              >
                <button
                  className="manual-entry-btn"
                  id="manualEntryBtn"
                  onClick={handleManualEntry}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "2rem",
                    color: "var(--primary-blue)",
                  }}
                  title="Add manual entry"
                >
                  <FaPlusCircle />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="discount-section">
        <h2 className="section-title">
          <FaTag className="icon" /> Apply Discount
        </h2>
        <div className="discount-inputs">
          <input
            type="text"
            inputMode="decimal"
            className="discount-amount"
            placeholder="Discount amount"
            value={discountAmount}
            onChange={(e) => {
              // Allow only digits and at most one dot
              let raw = e.target.value;
              // Remove any characters except digits and dot
              raw = raw.replace(/[^\d.]/g, "");
              // If more than one dot, keep first and remove the rest
              const allParts = raw.split(".");
              let intPart = allParts[0] ?? "";
              let fracPart = allParts.slice(1).join("") ?? ""; // join extra dots into frac

              if (discountType === "percentage") {
                // Limit to 2 decimal places for percentage
                fracPart = fracPart.slice(0, 2);
                // Build value; preserve trailing dot if user typed it
                let val =
                  fracPart.length > 0 ? intPart + "." + fracPart : intPart;
                if (raw.endsWith(".") && fracPart.length === 0)
                  val = intPart + ".";
                // Enforce percentage bounds 0-100 when parseable
                if (val !== "" && !val.endsWith(".")) {
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    if (num > 100) val = "100";
                    if (num < 0) val = "0";
                  }
                }
                setDiscountAmount(val);
                return;
              }

              // Fixed value behavior: limit integer to 10 digits, fraction to 4
              intPart = intPart.slice(0, 10);
              fracPart = fracPart.slice(0, 4);
              // If user typed a trailing dot, preserve it so they can enter decimals
              let finalVal =
                fracPart.length > 0 ? intPart + "." + fracPart : intPart;
              if (raw.endsWith(".") && fracPart.length === 0)
                finalVal = intPart + ".";
              setDiscountAmount(finalVal);
            }}
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
              inputMode="decimal"
              className="payment-input"
              placeholder="$0.00"
              value={cashAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.]/g, "");
                const parts = raw.split(".");
                let intPart = parts[0] ?? "";
                let fracPart = parts.slice(1).join("") ?? "";
                intPart = intPart.slice(0, 10);
                fracPart = fracPart.slice(0, 4);
                let finalVal =
                  fracPart.length > 0 ? intPart + "." + fracPart : intPart;
                if (raw.endsWith(".") && fracPart.length === 0)
                  finalVal = intPart + ".";
                setCashAmount(finalVal);
              }}
            />
          </div>
          <div className="payment-input-group">
            <label>Card Amount</label>
            <input
              type="text"
              inputMode="decimal"
              className="payment-input"
              placeholder="$0.00"
              value={cardAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.]/g, "");
                const parts = raw.split(".");
                let intPart = parts[0] ?? "";
                let fracPart = parts.slice(1).join("") ?? "";
                intPart = intPart.slice(0, 10);
                fracPart = fracPart.slice(0, 4);
                let finalVal =
                  fracPart.length > 0 ? intPart + "." + fracPart : intPart;
                if (raw.endsWith(".") && fracPart.length === 0)
                  finalVal = intPart + ".";
                setCardAmount(finalVal);
              }}
            />
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(4)}</span>
          </div>
          <div className="summary-row">
            <span>Discount:</span>
            <span>${discount.toFixed(4)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${tax.toFixed(4)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(4)}</span>
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
      <ScanModal
        show={showScanModal}
        onClose={() => setShowScanModal(false)}
        products={products}
        setProducts={setProducts}
      />
    </div>
  );
};

export default MainPosPage;
