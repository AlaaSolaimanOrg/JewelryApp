import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../../apis/sales.api/sales.api";
import ScanModal from "../../../components/modals/ScanModal/ScanModal";
import { DiscountType } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./posSale.scss";
import CustomerSection from "./PosSale.sections/CustomerSection/CustomerSection";
import PaymentSummary from "./PosSale.sections/PaymentSummary/PaymentSummary";
import ProductsSection from "./PosSale.sections/ProductsSection/ProductsSection";
import type { Customer, Product } from "./types";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

const MainPosPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [discountAmount, setDiscountAmount] = useState("0");
  const [discountType, setDiscountType] = useState(DiscountType.FixedAmount);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [isLoadingCreateSale, setIsLoadingCreateSale] = useState(false);

  // Calculate totals
  const subtotal = products?.reduce((sum, product) => {
    const quantity = product.quantityForSale || 1;
    const s =
      parseFloat(
        (Number(product.pricePerGram) *
          Number(product.weight) *
          quantity) as any,
      ) || 0;
    return sum + s;
  }, 0);

  const discount = discountAmount
    ? discountType === DiscountType.Percentage
      ? (subtotal * parseFloat(discountAmount.toString())) / 100
      : parseFloat(discountAmount.toString())
    : 0;
  const total = subtotal - discount;

  const anyProductWithUnfilledField = products.some((product) => {
    const quantity = product.quantityForSale || 0;
    return (
      !product.name ||
      !product.karatType ||
      !product.weight ||
      Number(product.weight) <= 0 ||
      !product.pricePerGram ||
      Number(product.pricePerGram) <= 0 ||
      quantity <= 0 ||
      (!product.manual && quantity > product.quantity) // Check stock for non-manual products
    );
  });

  const checkPaymentEqualTotal =
    Math.abs(total - (cashAmount + cardAmount)) < 0.001;

  const canSaveSale =
    !!customer?.id &&
    !!products.length &&
    (cardAmount > 0 || cashAmount > 0) &&
    !anyProductWithUnfilledField &&
    !isLoadingCreateSale &&
    checkPaymentEqualTotal &&
    products.every((p) => p.quantityForSale && p.quantityForSale > 0);

  // Sync payment amounts when total changes
  useEffect(() => {
    if (total > 0 && cashAmount === 0 && cardAmount === 0) {
      // Initial setup - set cash to total with proper precision
      setCashAmount(parseFloat(total.toFixed(4)));
    } else if (total > 0 && (cashAmount > 0 || cardAmount > 0)) {
      // When total changes, adjust payments to maintain ratio or reset to cash
      const currentPaymentTotal = parseFloat(
        (cashAmount + cardAmount).toFixed(4),
      );

      if (
        currentPaymentTotal > 0 &&
        Math.abs(currentPaymentTotal - total) > 0.01
      ) {
        // If there's a significant difference, reset to cash payment with proper precision
        setCashAmount(parseFloat(total.toFixed(4)));
        setCardAmount(0);
      }
    } else if (total === 0) {
      // Reset payments when no products
      setCashAmount(0);
      setCardAmount(0);
    }
  }, [total]); // This will run whenever total changes

  // Format number input value
  const formatNumberInput = (value: string): string => {
    const raw = value.replace(/[^\d.]/g, "");
    const parts = raw.split(".");
    let intPart = parts[0] ?? "";
    let fracPart = parts.slice(1).join("") ?? "";
    intPart = intPart.slice(0, 10);
    fracPart = fracPart.slice(0, 4);
    let finalVal = fracPart.length > 0 ? intPart + "." + fracPart : intPart;
    if (raw.endsWith(".") && fracPart.length === 0) finalVal = intPart + ".";
    return finalVal;
  };

  // Parse string to number with fixed precision
  const parseAmount = (value: string | number): number => {
    if (typeof value === "number") return parseFloat(value.toFixed(4));
    return parseFloat(parseFloat(value || "0").toFixed(4));
  };

  // Clamp value to not exceed total
  const clampToTotal = (value: number): number => {
    return Math.min(Math.max(0, value), total);
  };

  // Handle cash amount change
  const handleCashAmountChange = (value: string) => {
    const formattedValue = formatNumberInput(value);
    let cashValue = parseAmount(formattedValue);

    // Prevent cash amount from exceeding total
    cashValue = clampToTotal(cashValue);

    // Fix precision issues by rounding to 4 decimal places
    cashValue = parseFloat(cashValue.toFixed(4));

    setCashAmount(cashValue);

    // Calculate card amount as total - cash, and fix precision
    const cardValue = Math.max(0, parseFloat((total - cashValue).toFixed(4)));
    setCardAmount(cardValue);
  };

  // Handle card amount change
  const handleCardAmountChange = (value: string) => {
    const formattedValue = formatNumberInput(value);
    let cardValue = parseAmount(formattedValue);

    // Prevent card amount from exceeding total
    cardValue = clampToTotal(cardValue);

    // Fix precision issues by rounding to 4 decimal places
    cardValue = parseFloat(cardValue.toFixed(4));

    setCardAmount(cardValue);

    // Calculate cash amount as total - card, and fix precision
    const cashValue = Math.max(0, parseFloat((total - cardValue).toFixed(4)));
    setCashAmount(cashValue);
  };
  // Remove product
  const handleRemoveProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Apply a product's overridden price/gram to all products with the same karat type
  const handleApplyPriceToKarat = (
    karatType: any,
    pricePerGram: string | number,
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        Number(p.karatType) === Number(karatType) ? { ...p, pricePerGram } : p,
      ),
    );
  };

  // Update manual product
  const handleManualProductChange = (
    idx: number,
    field: string,
    value: any,
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

  const handleCreateSale = () => {
    setIsLoadingCreateSale(true);

    const payload = {
      customerId: customer?.id,
      discount:
        discountType == DiscountType.Percentage
          ? (Number(discountAmount) * subtotal) / 100
          : Number(discountAmount),
      discountPercentage:
        discountType == DiscountType.Percentage
          ? Number(discountAmount)
          : (Number(discountAmount) / subtotal) * 100,
      discountType:
        !!discountAmount && Number(discountAmount) > 0
          ? discountType
          : DiscountType.None,
      note: notes,
      cashAmount: parseAmount(cashAmount),
      cardAmount: parseAmount(cardAmount),
      saleItems: products.map((product) => {
        return {
          productId: product.id,
          productName: product.name,
          karatType: Number(product.karatType),
          weight: product.weight,
          quantity: product.quantityForSale || 1, // Include quantity here
          isManualProduct: product.manual,
          overriddenPricePerGram: product.pricePerGram,
          originalPricePerGram: product.originalPricePerGram,
        };
      }),
    };

    createSale(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          setTimeout(() => {
            navigate(`/receipt/${response.data}`);
          }, 3000);
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoadingCreateSale(false);
        }, 3000);
      });
  };

  const handleDiscountChange = (rawValue: string) => {
    const cleanValue = rawValue.replace(/[^\d.]/g, "");
    const [intPart = "", fracPart = ""] = cleanValue.split(".");

    let value = "";

    if (discountType === DiscountType.Percentage) {
      value = intPart;
      if (fracPart) value += "." + fracPart.slice(0, 2);
      if (cleanValue.endsWith(".") && !fracPart) value += ".";
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue > 100) value = "100";
        if (numValue < 0) value = "0";
      }
    } else {
      value = intPart.slice(0, 10);
      if (fracPart) value += "." + fracPart.slice(0, 4);
      if (cleanValue.endsWith(".") && !fracPart) value += ".";
    }

    setDiscountAmount(value);
  };

  return (
    <div id="mainPosPage" className="page-content">
      <CustomerSection
        customer={customer}
        setCustomer={setCustomer}
        customerInfoActive={customerInfoActive}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onAddCustomerClick={() => setShowAddCustomerModal(true)}
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
        onOpenScanModal={() => setShowScanModal(true)}
        setCustomerInfoActive={setCustomerInfoActive}
        showScanProduct
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes((s) => !s)}
      />

      <ProductsSection
        products={products}
        onProductAdded={(product) =>
          setProducts((prev) => [...prev, product])
        }
        handleRemoveProduct={handleRemoveProduct}
        handleManualProductChange={handleManualProductChange}
        onApplyPriceToKarat={handleApplyPriceToKarat}
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
            onChange={(e) => handleDiscountChange(e.target.value)}
          />
          <select
            className="discount-type"
            value={discountType}
            onChange={(e) => setDiscountType(Number(e.target.value))}
          >
            <option value={DiscountType.Percentage}>Percentage (%)</option>
            <option value={DiscountType.FixedAmount}>Fixed Value ($)</option>
          </select>
        </div>
      </section>

      {showNotes && (
        <section className="notes-section">
          <h2 className="section-title">Notes / Remarks</h2>
          <textarea
            className="notes-textarea"
            placeholder="Add any notes or remarks here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>
      )}

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
              onChange={(e) => handleCashAmountChange(e.target.value)}
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
              onChange={(e) => handleCardAmountChange(e.target.value)}
            />
          </div>
        </div>
      </section>
      <PaymentSummary
        subtotal={subtotal}
        discount={discount}
        total={total}
        handleCreateSale={handleCreateSale}
        canSaveSale={canSaveSale}
      />

      <ScanModal
        show={showScanModal}
        onClose={() => setShowScanModal(false)}
        products={products}
        setProducts={setProducts}
      />
      <LoadingScreen isLoading={isLoadingCreateSale} />
    </div>
  );
};

export default MainPosPage;
