import { useEffect, useState } from "react";
import { FaCreditCard, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import type { RefundMethod } from "../ReturnPage.type";
import { formatCurrency } from "../ReturnPage.utils";
import "./refundModal.scss";

interface RefundModalProps {
  show: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (method: RefundMethod) => void;
}

const RefundModal = ({ show, total, onClose, onConfirm }: RefundModalProps) => {
  const [method, setMethod] = useState<RefundMethod | "">("");

  useEffect(() => {
    if (show) setMethod("");
  }, [show]);

  if (!show) return null;

  const handleConfirm = () => {
    if (!method) return;
    onConfirm(method);
  };

  return (
    <div
      className="rp-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rp-modal">
        <div className="rp-modal-head">
          <span className="rp-modal-title">Refund payment</span>
          <button className="rp-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="rp-modal-body">
          <div className="rp-refund-amt">{formatCurrency(total)}</div>
          <div className="rp-field-label">Refund method</div>
          <div className="rp-ref-tabs">
            <div
              className={`rp-ref-tab ${method === "Cash" ? "sel-cash" : ""}`}
              onClick={() => setMethod("Cash")}
            >
              <FaMoneyBillWave className="rp-ref-ico" />
              <span className="rp-ref-lbl">Cash</span>
            </div>
            <div
              className={`rp-ref-tab ${method === "Card" ? "sel-card" : ""}`}
              onClick={() => setMethod("Card")}
            >
              <FaCreditCard className="rp-ref-ico" />
              <span className="rp-ref-lbl">Card</span>
            </div>
          </div>
          {method && <div className="rp-ref-status">Refund via {method}</div>}
          <button className="rp-ref-confirm" disabled={!method} onClick={handleConfirm}>
            {method ? `Confirm refund — ${formatCurrency(total)}` : "Select refund method"}
          </button>
          <button className="rp-ref-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
