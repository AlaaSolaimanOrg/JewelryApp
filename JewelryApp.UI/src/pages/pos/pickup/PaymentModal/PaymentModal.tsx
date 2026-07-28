import { useEffect, useState } from "react";
import { FaCreditCard, FaExchangeAlt, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import type { Repair } from "../PickUp.type";
import { formatCurrency } from "../PickUp.utils";
import "./paymentModal.scss";

type PayMethod = "" | "Cash" | "Card" | "Split";

interface PaymentModalProps {
  repair: Repair | null;
  onClose: () => void;
  onConfirm: (id: string, payMethod: string) => void;
}

const PaymentModal = ({ repair, onClose, onConfirm }: PaymentModalProps) => {
  const [method, setMethod] = useState<PayMethod>("");
  const [cashAmount, setCashAmount] = useState("0.00");
  const [cardAmount, setCardAmount] = useState("0.00");

  useEffect(() => {
    setMethod("");
    setCashAmount("0.00");
    setCardAmount("0.00");
  }, [repair]);

  if (!repair) return null;

  const cost = repair.cost;

  const handleSelectMethod = (next: PayMethod) => {
    setMethod(next);
    if (next === "Split") {
      setCashAmount(cost.toFixed(2));
      setCardAmount("0.00");
    }
  };

  const handleCashChange = (value: string) => {
    setCashAmount(value);
    setCardAmount(Math.max(0, cost - (parseFloat(value) || 0)).toFixed(2));
  };

  const handleCardChange = (value: string) => {
    setCardAmount(value);
    setCashAmount(Math.max(0, cost - (parseFloat(value) || 0)).toFixed(2));
  };

  const splitRemainder =
    cost - (parseFloat(cashAmount) || 0) - (parseFloat(cardAmount) || 0);
  const splitValid = Math.abs(splitRemainder) < 0.01;
  const canConfirm = method === "Split" ? splitValid : !!method;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const label =
      method === "Split"
        ? `Split (${formatCurrency(parseFloat(cashAmount) || 0)} cash / ${formatCurrency(
            parseFloat(cardAmount) || 0,
          )} card)`
        : method;
    onConfirm(repair.id, label);
  };

  return (
    <div
      className="pu-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pu-modal">
        <div className="pu-modal-head">
          <span className="pu-modal-title">Collect payment</span>
          <button className="pu-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="pu-modal-body">
          <div className="pu-pay-customer">
            {repair.customerName} — {repair.repairCode}
          </div>
          <div className="pu-pay-total">{formatCurrency(cost)}</div>

          <div className="pu-form-label">Payment method</div>
          <div className="pu-pay-options">
            <div
              className={`pu-pay-opt ${method === "Cash" ? "selected" : ""}`}
              onClick={() => handleSelectMethod("Cash")}
            >
              <FaMoneyBillWave className="pu-pay-opt-icon" />
              <span className="pu-pay-opt-label">Cash</span>
            </div>
            <div
              className={`pu-pay-opt ${method === "Card" ? "selected" : ""}`}
              onClick={() => handleSelectMethod("Card")}
            >
              <FaCreditCard className="pu-pay-opt-icon" />
              <span className="pu-pay-opt-label">Card</span>
            </div>
            <div
              className={`pu-pay-opt ${method === "Split" ? "selected" : ""}`}
              onClick={() => handleSelectMethod("Split")}
            >
              <FaExchangeAlt className="pu-pay-opt-icon" />
              <span className="pu-pay-opt-label">Split</span>
            </div>
          </div>

          {method === "Split" && (
            <div className="pu-split-fields">
              <div className="pu-split-grid">
                <div>
                  <div className="pu-form-label">Cash</div>
                  <input
                    type="number"
                    className="pu-form-input"
                    value={cashAmount}
                    min={0}
                    step="any"
                    inputMode="decimal"
                    onChange={(e) => handleCashChange(e.target.value)}
                  />
                </div>
                <div>
                  <div className="pu-form-label">Card</div>
                  <input
                    type="number"
                    className="pu-form-input"
                    value={cardAmount}
                    min={0}
                    step="any"
                    inputMode="decimal"
                    onChange={(e) => handleCardChange(e.target.value)}
                  />
                </div>
              </div>
              <div className={`pu-split-status ${splitValid ? "ok" : "bad"}`}>
                {splitValid
                  ? `Split: ${formatCurrency(parseFloat(cashAmount) || 0)} cash + ${formatCurrency(
                      parseFloat(cardAmount) || 0,
                    )} card`
                  : splitRemainder > 0
                    ? `${formatCurrency(splitRemainder)} remaining`
                    : "Amounts exceed total"}
              </div>
            </div>
          )}

          <div className="pu-modal-actions">
            <button className="pu-btn-save" disabled={!canConfirm} onClick={handleConfirm}>
              Confirm pickup
            </button>
            <button className="pu-btn-close-modal" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
