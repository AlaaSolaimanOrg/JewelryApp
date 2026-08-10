import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBarcode, FaExchangeAlt, FaStickyNote, FaTimes } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { createReturn } from "../../../apis/returns.api/returns.api";
import { createSale } from "../../../apis/sales.api/sales.api";
import ScanModal from "../../../components/modals/ScanModal/ScanModal";
import { DiscountType, RefundMethod } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./posSale.scss";
import CustomerSection from "./PosSale.sections/CustomerSection/CustomerSection";
import ExchangeSection from "./PosSale.sections/ExchangeSection/ExchangeSection";
import type { ExchangeApplyData } from "./PosSale.sections/ExchangeSection/ExchangeSection.type";
import PaymentMethodSection from "./PosSale.sections/PaymentMethodSection/PaymentMethodSection";
import type { PayMethod } from "./PosSale.sections/PaymentMethodSection/PaymentMethodSection.type";
import PaymentSummary from "./PosSale.sections/PaymentSummary/PaymentSummary";
import ProductsSection from "./PosSale.sections/ProductsSection/ProductsSection";
import TradeInSection from "./PosSale.sections/TradeInSection/TradeInSection";
import type { Customer, Product } from "./types";
import LoadingScreen from "../../../components/loaders/LoadingScreen/LoadingScreen";

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
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [isLoadingCreateSale, setIsLoadingCreateSale] = useState(false);

  // Trade-in is a UI-only stub — its credit affects the displayed total but is
  // not sent to the backend when the sale is saved.
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInCredit, setTradeInCredit] = useState(0);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeCredit, setExchangeCredit] = useState(0);
  const [exchangeData, setExchangeData] = useState<ExchangeApplyData | null>(null);

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

  const rawTotal = subtotal - discount - tradeInCredit - exchangeCredit;
  const total = Math.max(0, rawTotal);

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

  // Sync payment amounts to the selected payment method when the total changes
  useEffect(() => {
    if (payMethod === "cash") {
      setCashAmount(parseFloat(total.toFixed(4)));
      setCardAmount(0);
    } else if (payMethod === "card") {
      setCardAmount(parseFloat(total.toFixed(4)));
      setCashAmount(0);
    } else {
      const currentPaymentTotal = parseFloat((cashAmount + cardAmount).toFixed(4));
      if (currentPaymentTotal === 0 || Math.abs(currentPaymentTotal - total) > 0.01) {
        setCashAmount(parseFloat(total.toFixed(4)));
        setCardAmount(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

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

    if (payMethod === "split") {
      // Calculate card amount as total - cash, and fix precision
      const cardValue = Math.max(0, parseFloat((total - cashValue).toFixed(4)));
      setCardAmount(cardValue);
    }
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

    if (payMethod === "split") {
      // Calculate cash amount as total - card, and fix precision
      const cashValue = Math.max(0, parseFloat((total - cardValue).toFixed(4)));
      setCashAmount(cashValue);
    }
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
          if (exchangeData) {
            createReturn({
              saleId: exchangeData.saleId,
              refundMethod: RefundMethod.StoreCredit,
              items: exchangeData.items,
            }).catch((e) => {
              console.error(e);
              showError(
                `Sale saved, but the exchange return for ${exchangeData.saleSerialNumber} could not be processed. Please process it manually from Returns.`,
              );
            });
          }
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
    <div id="mainPosPage" className="pos-sale-page">
      <div className="ps-top-bar">
        <span className="ps-top-title">New Sale</span>
        <div className="ps-top-actions">
          <button
            className="ps-btn ps-btn-outline"
            onClick={() => setShowNotesModal(true)}
          >
            <FaStickyNote /> Notes
          </button>
          <button
            className="ps-btn ps-btn-red"
            onClick={() => setShowExchangeModal(true)}
          >
            <FaExchangeAlt /> Exchange
          </button>
          <button
            className="ps-btn ps-btn-amber"
            onClick={() => setShowTradeInModal(true)}
          >
            <GiGoldBar /> Trade-in
          </button>
          <button
            className="ps-btn ps-btn-outline"
            onClick={() => setShowScanModal(true)}
          >
            <FaBarcode /> Scan
          </button>
          <button className="ps-btn ps-btn-outline" onClick={() => navigate("/")}>
            <FaArrowLeft /> Back to POS
          </button>
        </div>
      </div>

      <div className="ps-main">
        <div className="ps-cart-col">
          <ProductsSection
            products={products}
            onProductAdded={(product) => setProducts((prev) => [...prev, product])}
            handleRemoveProduct={handleRemoveProduct}
            handleManualProductChange={handleManualProductChange}
            onApplyPriceToKarat={handleApplyPriceToKarat}
          />

          <TradeInSection
            show={showTradeInModal}
            onOpen={() => setShowTradeInModal(true)}
            onClose={() => setShowTradeInModal(false)}
            onCreditChange={setTradeInCredit}
          />

          <ExchangeSection
            show={showExchangeModal}
            onOpen={() => setShowExchangeModal(true)}
            onClose={() => setShowExchangeModal(false)}
            onCreditChange={setExchangeCredit}
            onExchangeChange={setExchangeData}
          />
        </div>

        <div className="ps-side-col">
          <CustomerSection
            customer={customer}
            setCustomer={setCustomer}
            customerInfoActive={customerInfoActive}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onAddCustomerClick={() => setShowAddCustomerModal(true)}
            showAddCustomerModal={showAddCustomerModal}
            setShowAddCustomerModal={setShowAddCustomerModal}
            setCustomerInfoActive={setCustomerInfoActive}
          />

          <section className="ps-panel">
            <h2 className="ps-panel-label">Discount</h2>
            <div className="ps-disc-row">
              <input
                type="text"
                inputMode="decimal"
                className="ps-disc-input"
                placeholder="Discount amount"
                value={discountAmount}
                onChange={(e) => handleDiscountChange(e.target.value)}
              />
              <select
                className="ps-disc-sel"
                value={discountType}
                onChange={(e) => setDiscountType(Number(e.target.value))}
              >
                <option value={DiscountType.Percentage}>%</option>
                <option value={DiscountType.FixedAmount}>$</option>
              </select>
            </div>
          </section>

          <PaymentMethodSection
            payMethod={payMethod}
            onPayMethodChange={setPayMethod}
            cashAmount={cashAmount}
            cardAmount={cardAmount}
            total={total}
            setCashAmount={setCashAmount}
            setCardAmount={setCardAmount}
            onCashInputChange={handleCashAmountChange}
            onCardInputChange={handleCardAmountChange}
          />

          <PaymentSummary
            subtotal={subtotal}
            discount={discount}
            tradeInCredit={tradeInCredit}
            exchangeCredit={exchangeCredit}
            rawTotal={rawTotal}
            handleCreateSale={handleCreateSale}
            canSaveSale={canSaveSale}
          />
        </div>
      </div>

      {showNotesModal && (
        <div
          className="ps-modal-overlay show"
          onClick={(e) => e.target === e.currentTarget && setShowNotesModal(false)}
        >
          <div className="ps-modal">
            <div className="ps-modal-head">
              <span className="ps-modal-title">Sale notes</span>
              <button className="ps-modal-close" onClick={() => setShowNotesModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="ps-modal-body">
              <div className="ps-fg">
                <label>Notes (printed on receipt)</label>
                <textarea
                  className="ps-notes-textarea"
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="ps-modal-btns">
                <button className="ps-btn ps-btn-gold" onClick={() => setShowNotesModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
