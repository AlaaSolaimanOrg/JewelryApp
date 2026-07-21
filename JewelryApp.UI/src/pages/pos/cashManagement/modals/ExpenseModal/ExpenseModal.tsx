import { useEffect, useState } from "react";
import { EXPENSE_CATEGORIES } from "../../CashManagement.utils";
import "./expenseModal.scss";

interface ExpenseModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (category: string, amount: number, notes: string) => void;
}

const ExpenseModal = ({ show, onClose, onSubmit }: ExpenseModalProps) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setCategory("");
      setAmount("");
      setNotes("");
    }
  }, [show]);

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Add expense</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-fg">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
            <label>Notes *</label>
            <textarea
              placeholder="What is this expense for?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              onClick={() => onSubmit(category, parseFloat(amount) || 0, notes.trim())}
            >
              Add expense
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

export default ExpenseModal;
