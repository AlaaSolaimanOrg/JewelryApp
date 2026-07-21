import { useEffect, useState } from "react";
import { formatCurrency, type LogEntry } from "../../CashManagement.utils";
import "./voidEntryModal.scss";

interface VoidEntryModalProps {
  show: boolean;
  entry: LogEntry | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const VoidEntryModal = ({
  show,
  entry,
  onClose,
  onSubmit,
}: VoidEntryModalProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (show) setReason("");
  }, [show]);

  if (!entry) return null;

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Void entry</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-original-entry">
            <div className="cash-original-label">ENTRY TO VOID</div>
            <div className="cash-original-desc">{entry.desc}</div>
            <div className="cash-original-amt">
              {entry.type === "in" ? "+" : "-"}
              {formatCurrency(entry.amount)} ({entry.box} box)
            </div>
          </div>
          <div className="cash-void-warning">
            This will create a reversal entry for the full amount. The
            original will be marked as voided but remains in the log.
          </div>
          <div className="cash-fg">
            <label>Reason for void *</label>
            <textarea
              placeholder="Why is this entry being voided?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-red"
              onClick={() => onSubmit(reason.trim())}
            >
              Void entry
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

export default VoidEntryModal;
