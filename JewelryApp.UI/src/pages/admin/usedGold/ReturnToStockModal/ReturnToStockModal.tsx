import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaBoxOpen, FaTimes } from "react-icons/fa";
import { KaratType, ProductCategory } from "../../../../types/enums";
import type { GoldPool } from "../UsedGold.type";
import type { ReturnToStockPayload } from "./ReturnToStockModal.type";
import "./returnToStockModal.scss";

const INVENTORY_KARATS: number[] = [
  KaratType.Karat24,
  KaratType.Karat22,
  KaratType.Karat21,
  KaratType.Karat18,
];

const CATEGORY_OPTIONS = [
  { value: ProductCategory.Necklaces, label: "Necklaces" },
  { value: ProductCategory.Bracelets, label: "Bracelets" },
  { value: ProductCategory.Bangles, label: "Bangles" },
  { value: ProductCategory.Rings, label: "Rings" },
  { value: ProductCategory.Earrings, label: "Earrings" },
  { value: ProductCategory.Pendants, label: "Pendants" },
  { value: ProductCategory.Bullion, label: "Bullion" },
];

interface ReturnToStockModalProps {
  show: boolean;
  onClose: () => void;
  pools: Record<number, GoldPool>;
  onConfirm: (payload: ReturnToStockPayload) => void;
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
  const [name, setName] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (show) {
      setKarat("");
      setWeight("");
      setNotes("");
      setName("");
      setCategory("");
      setDescription("");
    }
  }, [show]);

  if (!show) return null;

  const numKarat = Number(karat) || 0;
  const numWeight = Number(weight) || 0;
  const selectedPool = numKarat ? pools[numKarat] : null;
  const selectedAvailable = selectedPool?.weight ?? 0;
  const isValid =
    numKarat > 0 &&
    numWeight > 0 &&
    numWeight <= selectedAvailable + 0.01 &&
    !!name.trim() &&
    category !== "";

  const handleKaratChange = (raw: string) => {
    const next = raw === "" ? "" : Number(raw);
    setKarat(next);
    const nextAvailable = next === "" ? 0 : (pools[next]?.weight ?? 0);
    setWeight((prev) =>
      prev === "" || next === "" ? "" : Math.min(prev, nextAvailable),
    );
  };

  const handleWeightChange = (raw: string) => {
    if (raw === "") {
      setWeight("");
      return;
    }
    setWeight(Math.min(Number(raw), selectedAvailable));
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      karat: numKarat,
      weight: numWeight,
      notes: notes.trim() || undefined,
      name: name.trim(),
      category: Number(category),
      description: description.trim() || undefined,
    });
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
            Move a used item that is still in sale condition into inventory as a
            product. The weight is deducted from the used gold pool.
          </div>

          <div className="fg-row">
          <div className="fg2">
            <label>Product name *</label>
            <Form.Control
              type="text"
              placeholder="e.g. 21K rope chain"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="fg2">
            <label>Category *</label>
            <Form.Select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Form.Select>
          </div>
          </div>

          <div className="fg-row">
          <div className="fg2">
            <label>Karat *</label>
            <Form.Select
              value={karat}
              onChange={(e) =>
                handleKaratChange(e.target.value)
              }
            >
              <option value="">Select karat</option>
              {INVENTORY_KARATS.map((k) => (
                <option
                  key={k}
                  value={k}
                  disabled={(pools[k]?.weight ?? 0) <= 0}
                >
                  {k}K ({(pools[k]?.weight ?? 0).toFixed(2)}g available)
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="fg2">
            <label>Weight (grams) *</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              max={selectedAvailable}
              disabled={!numKarat}
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
            />
          </div>
          </div>

          {selectedPool && selectedPool.weight > 0 && (
            <div className="stock-avail">
              Available: {selectedPool.weight.toFixed(2)}g at $
              {(selectedPool.cost / selectedPool.weight).toFixed(2)}/g
            </div>
          )}

          <div className="fg-row">
          <div className="fg2">
            <label>Description</label>
            <Form.Control
              type="text"
              placeholder="Optional product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="fg2">
            <label>Notes</label>
            <Form.Control
              type="text"
              placeholder="Optional internal notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
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
            <FaBoxOpen /> Add to inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnToStockModal;
