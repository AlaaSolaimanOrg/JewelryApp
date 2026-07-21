import { useEffect, useState } from "react";
import { formatCurrency, type LogEntry } from "../../CashManagement.utils";
import "./correctEntryModal.scss";

interface CorrectEntryModalProps {
  show: boolean;
  entry: LogEntry | null;
  onClose: () => void;
  onSubmit: (newAmount: number, reason: string) => void;
}

const CorrectEntryModal = ({
  show,
  entry,
  onClose,
  onSubmit,
}: CorrectEntryModalProps) => {
  const [newAmount, setNewAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (show) {
      setNewAmount("");
      setReason("");
    }
  }, [show]);

  if (!entry) return null;

  const parsedAmount = parseFloat(newAmount) || 0;
  const diff = parsedAmount - entry.amount;
  const showDiff = parsedAmount > 0 && Math.abs(diff) > 0.01;
  const addsToBox =
    (entry.type === "in" && diff > 0) || (entry.type === "out" && diff < 0);

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Correct entry</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-original-entry">
            <div className="cash-original-label">ORIGINAL ENTRY</div>
            <div className="cash-original-desc">{entry.desc}</div>
            <div className="cash-original-amt">
              {entry.type === "in" ? "+" : "-"}
              {formatCurrency(entry.amount)} ({entry.box} box)
            </div>
          </div>
          <div className="cash-fg">
            <label>Correct amount to ($) *</label>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="Enter correct amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
          </div>
          {showDiff && (
            <div className="cash-diff-preview">
              Difference: {diff > 0 ? "+" : "-"}
              {formatCurrency(Math.abs(diff))} — will{" "}
              {addsToBox ? "add" : "remove"} {formatCurrency(Math.abs(diff))}{" "}
              {addsToBox ? "to" : "from"} {entry.box} box
            </div>
          )}
          <div className="cash-fg">
            <label>Reason for correction *</label>
            <textarea
              placeholder="Why is this being corrected?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              onClick={() => onSubmit(parsedAmount, reason.trim())}
            >
              Submit correction
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

export default CorrectEntryModal;
