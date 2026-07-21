import { useEffect, useState } from "react";
import { MANUAL_CASH_IN_SOURCES } from "../../CashManagement.utils";
import "./manualCashInModal.scss";

interface ManualCashInModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (source: string, amount: number, notes: string) => void;
}

const ManualCashInModal = ({
  show,
  onClose,
  onSubmit,
}: ManualCashInModalProps) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setSource("");
      setAmount("");
      setNotes("");
    }
  }, [show]);

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Manual cash in</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-fg">
            <label>Source *</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Select source</option>
              {MANUAL_CASH_IN_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="cash-fg">
            <label>Amount ($) *</label>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="cash-fg">
            <label>Notes</label>
            <input
              type="text"
              placeholder="Optional details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              onClick={() =>
                onSubmit(source, parseFloat(amount) || 0, notes.trim())
              }
            >
              Add cash in
            </button>
            <button className="cash-btn cash-btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualCashInModal;
