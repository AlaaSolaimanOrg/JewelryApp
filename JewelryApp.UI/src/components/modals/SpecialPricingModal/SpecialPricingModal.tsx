import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FaDollarSign } from "react-icons/fa";
import { getProductSpecialPricing } from "../../../apis/products.api/products.api";
import "./specialPricingModal.scss";

interface ProductMinimal {
  id: string;
  sku: string;
  pricePerGram?: number;
}

interface SpecialPricingModalProps {
  show: boolean;
  onClose: () => void;
  product: ProductMinimal | null;
  onConfirm: (productId: string, pricePerGram: number) => void;
}

const SpecialPricingModal: React.FC<SpecialPricingModalProps> = ({
  show,
  onClose,
  product,
  onConfirm,
}) => {
  const [price, setPrice] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (show && product) {
      setPrice("");
      setIsFetching(true);
      getProductSpecialPricing({ productId: product.id })
        .then((res) => {
          if (res?.data !== null && res?.data !== undefined) {
            setPrice(String(res.data));
          }
        })
        .finally(() => setIsFetching(false));
    }
  }, [show, product]);

  if (!product) return null;

  const parsedPrice = parseFloat(price);
  const isValid = price !== "" && !isNaN(parsedPrice) && parsedPrice > 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(product.id, parsedPrice);
  };

  return (
    <Modal show={show} onHide={onClose} centered className="special-pricing-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaDollarSign className="me-2" /> Special Price — {product.sku}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="special-pricing-section">
          {product.pricePerGram !== undefined && product.pricePerGram > 0 && (
            <div className="global-price-hint">
              Global price per gram:{" "}
              <strong>{product.pricePerGram.toFixed(2)}</strong>
            </div>
          )}

          <div className="control-group">
            <label className="control-label">Special Price per Gram</label>
            {isFetching ? (
              <div className="d-flex align-items-center gap-2 mt-2">
                <Spinner animation="border" size="sm" />
                <small>Loading current value…</small>
              </div>
            ) : (
              <Form.Control
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                min={0.0001}
                step={0.01}
                placeholder="e.g. 250.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
            <small className="text-muted mt-2 d-block">
              Leave unchanged or enter a new value to override global pricing.
            </small>
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
          disabled={!isValid || isFetching}
        >
          <FaDollarSign className="me-2" /> Set Price
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SpecialPricingModal;
