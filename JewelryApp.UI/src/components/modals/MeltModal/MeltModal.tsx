import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaFire, FaTimes } from "react-icons/fa";
import { showError } from "../../../utils";
import "./meltModal.scss";

interface ProductMinimal {
  id: string;
  sku: string;
  quantity: number;
  weight?: number;
  karatType?: number;
}

interface MeltModalProps {
  show: boolean;
  onClose: () => void;
  product: ProductMinimal | null;
  onConfirm: (productId: string, quantity: number) => void;
}

const MeltModal: React.FC<MeltModalProps> = ({
  show,
  onClose,
  product,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState<number | "">(0);

  useEffect(() => {
    if (show && product) {
      setQuantity(Math.min(1, product.quantity));
    }
  }, [show, product]);

  if (!show || !product) return null;

  const numQuantity = Number(quantity) || 0;
  const isValid = numQuantity >= 1 && numQuantity <= product.quantity;
  const totalWeight = (numQuantity * (product.weight ?? 0)).toFixed(2);

  const handleConfirm = () => {
    if (!isValid) {
      showError("Please enter a valid quantity within allowed range.");
      return;
    }

    onConfirm(product.id, numQuantity);
  };

  return (
    <div className="melt-modal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <FaFire /> Melt product — <span className="sku">{product.sku}</span>
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mo-body">
          <div className="fg2">
            <label>Quantity to melt</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={1}
              max={product.quantity}
              step={1}
              value={quantity}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setQuantity("");
                  return;
                }
                const val = Number(raw);
                if (Number.isNaN(val)) {
                  setQuantity("");
                  return;
                }
                setQuantity(Math.max(0, Math.min(val, product.quantity)));
              }}
            />
            <div className="hint">Available: {product.quantity}</div>
          </div>

          <div className="item-summary">
            <span>
              SKU: <b>{product.sku}</b>
            </span>
            <span>
              Weight: <b>{product.weight ?? 0}g each</b>
            </span>
            <span>
              Karat: <b>{product.karatType}K</b>
            </span>
            <span>
              Total to melt: <b>{totalWeight}g</b>
            </span>
          </div>
        </div>

        <div className="mo-foot">
          <button className="mo-btn mo-btn-dark" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mo-btn mo-btn-amber"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            <FaFire />{" "}
            {isValid
              ? `Melt ${numQuantity} item${numQuantity !== 1 ? "s" : ""}`
              : "Invalid quantity"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeltModal;
