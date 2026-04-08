import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { FaFire } from "react-icons/fa";
import { showError } from "../../../utils";
import "./meltModal.scss";

interface ProductMinimal {
  id: string;
  sku: string;
  quantity: number;
  weight?: number;
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

  if (!product) return null;

  const handleConfirm = () => {
    if (Number(quantity) < 0 || Number(quantity) > product.quantity) {
      showError("Please enter a valid quantity within allowed range.");
      return;
    }

    onConfirm(product.id, Number(quantity));
  };

  return (
    <Modal show={show} onHide={onClose} centered className="melt-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFire className="me-2" /> Melt Product — {product.sku}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="melt-section">
          <div className="control-group">
            <label className="control-label">Quantity to Melt</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
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
                const clamped = Math.max(0, Math.min(val, product.quantity));
                setQuantity(clamped);
              }}
            />
            <small className="text-muted mt-2 d-block">
              Available: {product.quantity}
            </small>
          </div>

          <div className="info-text mt-3">
            <div className="d-flex justify-content-between">
              <small>
                SKU: <strong>{product.sku}</strong>
              </small>
              <small>
                Weight: <strong>{product.weight}g</strong>
              </small>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>

        <button
          className="btn btn-primary btn-gold"
          onClick={handleConfirm}
          disabled={quantity === "" || quantity === 0}
        >
          <FaFire className="me-2" /> Melt {quantity} Item(s)
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MeltModal;
