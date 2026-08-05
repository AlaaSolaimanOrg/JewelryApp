import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { FaDollarSign, FaTimes } from "react-icons/fa";
import { getProductSpecialPricing } from "../../../apis/products.api/products.api";
import "./specialPricingModal.scss";

interface ProductMinimal {
  id: string;
  sku: string;
  pricePerGram?: number;
  weight?: number;
  karatType?: number;
  price?: number;
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

  if (!show || !product) return null;

  const parsedPrice = parseFloat(price);
  const isValid = price !== "" && !isNaN(parsedPrice) && parsedPrice > 0;
  const newTotal = isValid ? parsedPrice * (product.weight ?? 0) : null;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(product.id, parsedPrice);
  };

  return (
    <div className="special-pricing-modal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <FaDollarSign /> Special price — <span className="sku">{product.sku}</span>
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mo-body">
          {product.pricePerGram !== undefined && product.pricePerGram > 0 && (
            <div className="info-strip">
              Global {product.karatType ? `${product.karatType}K ` : ""}price
              per gram: <b>${product.pricePerGram.toFixed(2)}</b>
            </div>
          )}

          <div className="fg2">
            <label>Special price per gram</label>
            {isFetching ? (
              <div className="fetching-row">
                <Spinner animation="border" size="sm" />
                <span>Loading current value…</span>
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
            <div className="hint">
              Leave unchanged or enter a new value to override global pricing
              for this item only.
            </div>
          </div>

          <div className="item-summary">
            <span>
              SKU: <b>{product.sku}</b>
            </span>
            <span>
              Weight: <b>{product.weight ?? 0}g</b>
            </span>
            {product.price !== undefined && (
              <span>
                Current price: <b>${product.price.toFixed(2)}</b>
              </span>
            )}
            {newTotal !== null && (
              <span className="new-price">
                New price: <b>${newTotal.toFixed(2)}</b>
              </span>
            )}
          </div>
        </div>

        <div className="mo-foot">
          <button className="mo-btn mo-btn-dark" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mo-btn mo-btn-gold"
            onClick={handleConfirm}
            disabled={!isValid || isFetching}
          >
            <FaDollarSign /> Set price
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialPricingModal;
