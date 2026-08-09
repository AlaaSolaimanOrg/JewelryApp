import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaBoxOpen, FaTimes } from "react-icons/fa";
import type { GoldPool } from "../UsedGold.type";
import { getAllKarats } from "../UsedGold.utils";
import "./returnToStockModal.scss";

interface ReturnToStockModalProps {
  show: boolean;
  onClose: () => void;
  pools: Record<number, GoldPool>;
  onConfirm: (karat: number, weight: number, notes: string) => void;
}

const ReturnToStockModal: React.FC<ReturnToStockModalProps> = ({
  show,
  onClose,
  pools,
  onConfirm,
}) => {
  const [karat, setKarat] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setKarat("");
      setWeight("");
      setNotes("");
    }
  }, [show]);

  if (!show) return null;

  const availableKarats = getAllKarats(pools).filter((k) => pools[k].weight > 0);
  const numKarat = Number(karat) || 0;
  const numWeight = Number(weight) || 0;
  const selectedPool = numKarat ? pools[numKarat] : null;
  const isValid =
    numKarat > 0 && numWeight > 0 && !!selectedPool && numWeight <= selectedPool.weight + 0.01;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(numKarat, numWeight, notes.trim());
  };

  return (
    <div className="return-stock-modal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <FaBoxOpen /> Return to stock
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mo-body">
          <div className="mo-hint">
            Move used gold back to display inventory for sale. Enter the
            karat and weight.
          </div>

          <div className="fg2">
            <label>Karat *</label>
            <Form.Select
              value={karat}
              onChange={(e) =>
                setKarat(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Select karat</option>
              {availableKarats.map((k) => (
                <option key={k} value={k}>
                  {k}K ({pools[k].weight.toFixed(2)}g available)
                </option>
              ))}
            </Form.Select>
          </div>

          {selectedPool && (
            <div className="stock-avail">
              Available: {selectedPool.weight.toFixed(2)}g at $
              {(selectedPool.cost / selectedPool.weight).toFixed(2)}/g
            </div>
          )}

          <div className="fg2">
            <label>Weight (grams) *</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={weight}
              onChange={(e) => {
                const raw = e.target.value;
                setWeight(raw === "" ? "" : Number(raw));
              }}
            />
          </div>

          <div className="fg2">
            <label>Notes</label>
            <Form.Control
              type="text"
              placeholder="e.g. 21K ring for display"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mo-foot">
          <button className="mo-btn mo-btn-dark" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mo-btn mo-btn-gold"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            <FaBoxOpen /> Return to stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnToStockModal;
