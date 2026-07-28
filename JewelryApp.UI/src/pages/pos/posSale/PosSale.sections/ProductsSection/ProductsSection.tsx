import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import type { Product } from "../../types";
import "./productsSection.scss";
import preventSignOnKeyDown from "../../../../../utils";
import AddProductModal from "../../../../../components/modals/AddProductModal/AddProductModal";

interface Props {
  products: Product[];
  onProductAdded: (product: any) => void;
  handleRemoveProduct: (idx: number) => void;
  handleManualProductChange: (idx: number, field: string, value: any) => void;
  onApplyPriceToKarat: (karatType: any, pricePerGram: string | number) => void;
}

const formatSubtotal = (value: number) => {
  if (value % 1 === 0) return value.toString();
  return value
    .toFixed(4)
    .replace(/\.?(0{1,4})$/, "")
    .replace(/(\.\d{1,4})\d*$/, "$1");
};

const ProductsSection: React.FC<Props> = ({
  products,
  onProductAdded,
  handleRemoveProduct,
  handleManualProductChange,
  onApplyPriceToKarat,
}) => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleQuantityChange = (idx: number, value: string) => {
    // Prevent negative numbers and ensure it's a valid number
    const numValue = Math.max(0, parseInt(value) || 0);

    // Ensure quantity doesn't exceed available stock for non-manual products
    if (!products[idx].manual && numValue > products[idx].quantity) {
      return; // Don't update if exceeding available quantity
    }

    handleManualProductChange(idx, "quantityForSale", numValue);
  };

  return (
    <section className="ps-cart-box">
      <div className="ps-cart-header">
        <span className="ps-cart-title">Cart</span>
        <span className="ps-cart-count">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {products.length > 0 && (
        <div className="ps-cart-cols">
          <span className="ps-col-lbl">Product</span>
          <span className="ps-col-lbl ps-col-center">Qty</span>
          <span className="ps-col-lbl ps-col-center">Avail</span>
          <span className="ps-col-lbl ps-col-center">Weight</span>
          <span className="ps-col-lbl ps-col-center">$/g</span>
          <span className="ps-col-lbl ps-col-right">Subtotal</span>
          <span />
        </div>
      )}

      <div className="ps-cart-items">
        {!products.length && (
          <div className="ps-cart-empty">
            <div className="ps-cart-empty-txt">Cart is empty</div>
            <button
              className="ps-btn ps-btn-gold"
              onClick={() => setShowAddProductModal(true)}
            >
              <FaPlus /> Add first item
            </button>
          </div>
        )}

        {products.map((product, idx) => {
          const quantity = product.quantityForSale || 1;
          const subtotal =
            parseFloat(product.pricePerGram?.toString() ?? "0") *
            parseFloat(product.weight?.toString() ?? "0") *
            quantity;
          const canApplyToKarat =
            Number(product.pricePerGram) !== Number(product.originalPricePerGram) &&
            products.some(
              (p, i) =>
                i !== idx &&
                Number(p.karatType) === Number(product.karatType) &&
                Number(p.pricePerGram) !== Number(product.pricePerGram),
            );

          return (
            <div className="ps-cart-row" key={idx}>
              <div>
                <div className="ps-cr-name">{product.name}</div>
                <div className="ps-cr-meta">
                  {product.karatType}K {product.productType} ·{" "}
                  {product.sku ?? "—"}
                </div>
              </div>

              <input
                type="number"
                className="ps-cr-input"
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Qty"
                value={product.quantityForSale || 0}
                min="1"
                max={product.manual ? undefined : product.quantity}
                onKeyDown={preventSignOnKeyDown}
                onChange={(e) => handleQuantityChange(idx, e.target.value)}
              />

              <div className="ps-cr-avail">{product.quantity}</div>

              <input
                type="text"
                className="ps-cr-input"
                value={product.weight as any}
                onChange={(e) =>
                  handleManualProductChange(idx, "weight", e.target.value)
                }
                maxLength={10}
              />

              <div className="ps-cr-ppg-wrap">
                <input
                  type="text"
                  className="ps-cr-input"
                  value={product.pricePerGram as any}
                  onChange={(e) =>
                    handleManualProductChange(idx, "pricePerGram", e.target.value)
                  }
                  maxLength={10}
                />
                {canApplyToKarat && (
                  <button
                    className="ps-cr-apply"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      onApplyPriceToKarat(product.karatType, product.pricePerGram)
                    }
                  >
                    Apply to all {product.karatType}K
                  </button>
                )}
              </div>

              <div className="ps-cr-sub">${formatSubtotal(subtotal)}</div>

              <button
                className="ps-cr-remove"
                onClick={() => handleRemoveProduct(idx)}
              >
                <FaTimes />
              </button>

              {!product.manual && product.quantityForSale > product.quantity && (
                <div className="ps-cr-stock-warning">Exceeds available stock</div>
              )}
            </div>
          );
        })}
      </div>

      {products.length > 0 && (
        <div className="ps-cart-footer">
          <button
            className="ps-btn ps-btn-gold"
            onClick={() => setShowAddProductModal(true)}
          >
            <FaPlus /> Add item
          </button>
        </div>
      )}

      <AddProductModal
        show={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductAdded={(product) => {
          onProductAdded(product);
          setShowAddProductModal(false);
        }}
      />
    </section>
  );
};

export default ProductsSection;
