import { useEffect, useState } from "react";
import { FaCreditCard, FaExchangeAlt, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import type { Repair } from "../RepairOrders.type";
import { formatCurrency, formatPhone } from "../RepairOrders.utils";

type PayMethod = "" | "Cash" | "Card" | "Split";

interface EditModalProps {
  repair: Repair | null;
  onClose: () => void;
  onSave: (
    id: string,
    changes: {
      notes: string;
      cost: number;
      dueDate: string;
      paid: boolean;
      payMethod?: string;
    },
  ) => void;
  onCancelRepair: (id: string) => void;
}

const EditModal = ({ repair, onClose, onSave, onCancelRepair }: EditModalProps) => {
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("0");
  const [paid, setPaid] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("");
  const [cashAmount, setCashAmount] = useState("0.00");
  const [cardAmount, setCardAmount] = useState("0.00");

  useEffect(() => {
    if (!repair) return;
    setNotes(repair.notes);
    setCost(String(repair.cost));
    setPaid(repair.paid);
    setDueDate(repair.dueDate);
    setPayMethod("");
    setCashAmount(repair.cost.toFixed(2));
    setCardAmount("0.00");
  }, [repair]);

  if (!repair) return null;

  const costValue = parseFloat(cost) || 0;
  const newlyPaid = paid && !repair.paid;

  const handleSelectMethod = (next: PayMethod) => {
    setPayMethod(next);
    if (next === "Split") {
      setCashAmount(costValue.toFixed(2));
      setCardAmount("0.00");
    }
  };

  const handleCashChange = (value: string) => {
    setCashAmount(value);
    setCardAmount(Math.max(0, costValue - (parseFloat(value) || 0)).toFixed(2));
  };

  const handleCardChange = (value: string) => {
    setCardAmount(value);
    setCashAmount(Math.max(0, costValue - (parseFloat(value) || 0)).toFixed(2));
  };

  const splitRemainder =
    costValue - (parseFloat(cashAmount) || 0) - (parseFloat(cardAmount) || 0);
  const splitValid = Math.abs(splitRemainder) < 0.01;
  const methodValid = !newlyPaid || (payMethod === "Split" ? splitValid : !!payMethod);

  const handleSave = () => {
    if (!methodValid) return;

    const label =
      payMethod === "Split"
        ? `Split (${formatCurrency(parseFloat(cashAmount) || 0)} cash / ${formatCurrency(
            parseFloat(cardAmount) || 0,
          )} card)`
        : payMethod;

    onSave(repair.id, {
      notes,
      cost: costValue,
      dueDate,
      paid,
      payMethod: newlyPaid ? label : undefined,
    });
  };

  return (
    <div
      className="pu-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pu-modal pu-modal-lg">
        <div className="pu-modal-head">
          <span className="pu-modal-title">Edit {repair.repairCode}</span>
          <button className="pu-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="pu-modal-body">
          <div className="pu-form-grid">
            <div className="pu-form-group">
              <div className="pu-form-label">Customer</div>
              <div className="pu-form-static">
                {repair.customerName} — {formatPhone(repair.customerPhone)}
              </div>
            </div>
            <div className="pu-form-group">
              <div className="pu-form-label">Slot</div>
              <div className="pu-form-static">
                {repair.slotNumber != null ? `Slot ${repair.slotNumber}` : "—"}
              </div>
            </div>
            <div className="pu-form-group">
              <div className="pu-form-label">Cost ($)</div>
              <input
                type="number"
                className="pu-form-input"
                value={cost}
                min={0}
                step="0.01"
                inputMode="decimal"
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="pu-form-group">
              <div className="pu-form-label">Payment status</div>
              <select
                className="pu-form-input"
                value={paid ? "paid" : "unpaid"}
                onChange={(e) => setPaid(e.target.value === "paid")}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {newlyPaid && (
              <div className="pu-form-group pu-form-group-full">
                <div className="pu-form-label">Payment method</div>
                <div className="pu-pay-options">
                  <div
                    className={`pu-pay-opt ${payMethod === "Cash" ? "selected" : ""}`}
                    onClick={() => handleSelectMethod("Cash")}
                  >
                    <FaMoneyBillWave className="pu-pay-opt-icon" />
                    <span className="pu-pay-opt-label">Cash</span>
                  </div>
                  <div
                    className={`pu-pay-opt ${payMethod === "Card" ? "selected" : ""}`}
                    onClick={() => handleSelectMethod("Card")}
                  >
                    <FaCreditCard className="pu-pay-opt-icon" />
                    <span className="pu-pay-opt-label">Card</span>
                  </div>
                  <div
                    className={`pu-pay-opt ${payMethod === "Split" ? "selected" : ""}`}
                    onClick={() => handleSelectMethod("Split")}
                  >
                    <FaExchangeAlt className="pu-pay-opt-icon" />
                    <span className="pu-pay-opt-label">Split</span>
                  </div>
                </div>

                {payMethod === "Split" && (
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
              </div>
            )}

            <div className="pu-form-group pu-form-group-full">
              <div className="pu-form-label">Due date</div>
              <input
                type="date"
                className="pu-form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="pu-form-group pu-form-group-full">
              <div className="pu-form-label">Notes ({notes.length}/1000)</div>
              <textarea
                className="pu-form-textarea"
                value={notes}
                maxLength={1000}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="pu-modal-actions">
            <button className="pu-btn-save" disabled={!methodValid} onClick={handleSave}>
              Save changes
            </button>
            <button
              className="pu-btn-cancel-repair"
              onClick={() => onCancelRepair(repair.id)}
            >
              Cancel repair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
