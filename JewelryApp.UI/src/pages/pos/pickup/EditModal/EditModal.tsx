import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { Repair } from "../PickUp.type";
import { formatPhone } from "../PickUp.utils";
import "./editModal.scss";

interface EditModalProps {
  repair: Repair | null;
  onClose: () => void;
  onSave: (
    id: string,
    changes: { notes: string; cost: number; dueDate: string; paid: boolean },
  ) => void;
  onCancelRepair: (id: string) => void;
}

const EditModal = ({ repair, onClose, onSave, onCancelRepair }: EditModalProps) => {
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("0");
  const [paid, setPaid] = useState(false);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!repair) return;
    setNotes(repair.notes);
    setCost(String(repair.cost));
    setPaid(repair.paid);
    setDueDate(repair.dueDate);
  }, [repair]);

  if (!repair) return null;

  const handleSave = () => {
    onSave(repair.id, {
      notes,
      cost: parseFloat(cost) || 0,
      dueDate,
      paid,
    });
  };

  return (
    <div
      className="pu-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pu-modal">
        <div className="pu-modal-head">
          <span className="pu-modal-title">Edit {repair.repairCode}</span>
          <button className="pu-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="pu-modal-body">
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
            <div className="pu-form-label">Notes</div>
            <textarea
              className="pu-form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
          <div className="pu-form-group">
            <div className="pu-form-label">Due date</div>
            <input
              type="date"
              className="pu-form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="pu-modal-actions">
            <button className="pu-btn-save" onClick={handleSave}>
              Save changes
            </button>
            <button
              className="pu-btn-cancel-repair"
              onClick={() => onCancelRepair(repair.id)}
            >
              Cancel repair
            </button>
          </div>
          <button className="pu-btn-close-modal pu-btn-close-modal-block" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
