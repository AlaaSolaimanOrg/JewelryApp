import { useEffect, useState } from "react";
import "./transferIncomeModal.scss";

interface TransferIncomeModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (
    customerName: string,
    amount: number,
    destination: string,
    notes: string,
  ) => void;
}

const TransferIncomeModal = ({
  show,
  onClose,
  onSubmit,
}: TransferIncomeModalProps) => {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setCustomerName("");
      setAmount("");
      setDestination("");
      setNotes("");
    }
  }, [show]);

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Transfer income</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-fg">
            <label>Customer name *</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
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
            <label>Destination country</label>
            <input
              type="text"
              placeholder="e.g. Lebanon, Iraq"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="cash-fg">
            <label>Notes</label>
            <input
              type="text"
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              onClick={() =>
                onSubmit(
                  customerName.trim(),
                  parseFloat(amount) || 0,
                  destination.trim(),
                  notes.trim(),
                )
              }
            >
              Add transfer
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

export default TransferIncomeModal;
