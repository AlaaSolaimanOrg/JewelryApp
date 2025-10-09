import React, { useState } from "react";
import "./posSale.scss";
import ScanModal from "../../../components/ScanModal/ScanModal";
import ProductsSection from "./ProductsSection";
import CustomerSection from "./CustomerSection";
import PaymentSummary from "./PaymentSummary";
import { initialCustomer } from "./types";
import type { Product } from "./types";
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

const MainPosPage: React.FC = () => {
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

  // Calculate totals
  const subtotal = products?.reduce((sum, product) => {
    const s = parseFloat(product.subtotal as any) || 0;
    return sum + s;
  }, 0);

  const discount = discountAmount
    ? discountType === "percentage"
      ? (subtotal * parseFloat(discountAmount)) / 100
      : parseFloat(discountAmount)
    : 0;
  const tax = parseFloat((subtotal * 0.06).toFixed(4));
  const total = subtotal - discount + tax;

  // Search input enter
  const handleSearchKeyUp = (e: any) => {
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
        karatType: "18K",
        weight: 0,
        pricePerGram: 0,
        manual: true,
        id: "",
        sku: "",
        quantity: 0,
        category: 0 as any,
        productType: 0 as any,
        description: "",
        price: 0,
      },
    ]);
  };

  // Remove product
  const handleRemoveProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Update manual product
  const handleManualProductChange = (
    idx: number,
    field: string,
    value: any
  ) => {
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
      (updated as any)[idx][field] = val;
      // Calculate subtotal if possible
      if (field === "weight" || field === "pricePerGram") {
        const w = parseFloat(updated[idx].weight?.toString() ?? "0") || 0;
        const ppg =
          parseFloat(updated[idx].pricePerGram?.toString() ?? "0") || 0;
        const s = w * ppg;
        // Show up to 4 decimals, but no trailing zeroes
        (updated as any)[idx].subtotal =
          s % 1 === 0
            ? s.toString()
            : s
                .toFixed(4)
                .replace(/\.?(0{1,4})$/, "")
                .replace(/(\.\d{1,4})\d*$/, "$1");
      }
      return updated;
    });
  };

  return (
    <div id="mainPosPage" className="page-content">
      <CustomerSection
        customer={customer}
        customerInfoActive={customerInfoActive}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearchEnter={handleSearchKeyUp}
        onAddCustomerClick={() => setShowAddCustomerModal(true)}
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
        onOpenScanModal={() => setShowScanModal(true)}
      />

      <ProductsSection
        products={products}
        handleManualEntry={handleManualEntry}
        handleRemoveProduct={handleRemoveProduct}
        handleManualProductChange={handleManualProductChange}
      />

      <section className="discount-section">
        <h2 className="section-title">Apply Discount</h2>
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
              raw = raw.replace(/[^\d.]/g, "");
              const allParts = raw.split(".");
              let intPart = allParts[0] ?? "";
              let fracPart = allParts.slice(1).join("") ?? "";

              if (discountType === "percentage") {
                fracPart = fracPart.slice(0, 2);
                let val =
                  fracPart.length > 0 ? intPart + "." + fracPart : intPart;
                if (raw.endsWith(".") && fracPart.length === 0)
                  val = intPart + ".";
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

              intPart = intPart.slice(0, 10);
              fracPart = fracPart.slice(0, 4);
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
        <h2 className="section-title">Notes / Remarks</h2>
        <textarea
          className="notes-textarea"
          placeholder="Add any notes or remarks here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      <section className="payment-section">
        <h2 className="section-title">Payment</h2>
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

        <PaymentSummary
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          total={total}
        />
      </section>

      {/* ScanModal props typed differently in project; cast to any to preserve runtime behavior */}
      <ScanModal
        {...({
          show: showScanModal,
          onClose: () => setShowScanModal(false),
          products,
          setProducts,
        } as any)}
      />
    </div>
  );
};

export default MainPosPage;
