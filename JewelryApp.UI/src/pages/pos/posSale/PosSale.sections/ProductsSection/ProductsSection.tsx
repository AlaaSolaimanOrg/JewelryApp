import { useEffect, useRef, useState } from "react";
import { FaClone, FaEllipsisV, FaPlusCircle, FaTimes } from "react-icons/fa";
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

const ProductsSection: React.FC<Props> = ({
  products,
  onProductAdded,
  handleRemoveProduct,
  handleManualProductChange,
  onApplyPriceToKarat,
}) => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
    <section className="products-section">
      <h2 className="section-title">Cart Summary</h2>

      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Karat</th>
            <th>Quantity</th>
            <th>Quantity Available</th>
            <th>Weight</th>
            <th>Price/Gram</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="productsTableBody">
          {products?.map((product, idx) => (
            <tr key={idx}>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {product.images?.[0] && (
                    <img
                      className="product-image"
                      src={`${import.meta.env.VITE_API_URL}${
                        product.images[0]?.imageUrl
                      }`}
                      alt={product.name}
                    />
                  )}
                  <div style={{ marginLeft: "10px" }}>{product.name}</div>
                </div>
              </td>
              <td>{product.karatType}</td>
              <td>
                <input
                  type="number"
                  onWheel={(e) => e.currentTarget.blur()}
                  className="weight-input"
                  placeholder="Qty"
                  value={product.quantityForSale || 0}
                  min="1"
                  max={product.manual ? undefined : product.quantity}
                  onKeyDown={preventSignOnKeyDown}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  style={{ width: "70px" }}
                />
                {!product.manual &&
                  product.quantityForSale > product.quantity && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      Exceeds available stock
                    </div>
                  )}
              </td>
              <td>{product.quantity}</td>
              <td>
                <input
                  type="text"
                  className="weight-input"
                  placeholder=""
                  value={product.weight as any}
                  onChange={(e) =>
                    handleManualProductChange(idx, "weight", e.target.value)
                  }
                  maxLength={10}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="price-input"
                  placeholder=""
                  value={product.pricePerGram as any}
                  onChange={(e) =>
                    handleManualProductChange(
                      idx,
                      "pricePerGram",
                      e.target.value,
                    )
                  }
                  maxLength={10}
                />
              </td>
              <td>
                <span>
                  {(() => {
                    const quantity = product.quantityForSale || 1;
                    const subtotal =
                      parseFloat(product.pricePerGram?.toString() ?? "0") *
                      parseFloat(product.weight?.toString() ?? "0") *
                      quantity;
                    if (subtotal % 1 === 0) return subtotal;
                    return subtotal
                      .toFixed(4)
                      .replace(/\.?(0{1,4})$/, "")
                      .replace(/(\.\d{1,4})\d*$/, "$1");
                  })()}
                </span>
              </td>
              <td>
                {(() => {
                  const hasApplyAction =
                    Number(product.pricePerGram) !==
                      Number(product.originalPricePerGram) &&
                    products.some(
                      (p, i) =>
                        i !== idx &&
                        Number(p.karatType) === Number(product.karatType) &&
                        Number(p.pricePerGram) !== Number(product.pricePerGram),
                    );

                  if (!hasApplyAction) {
                    return (
                      <div className="action-cell">
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveProduct(idx)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      className="action-cell"
                      ref={openMenuIdx === idx ? menuRef : null}
                    >
                      <button
                        className="action-menu-btn"
                        onClick={() =>
                          setOpenMenuIdx(openMenuIdx === idx ? null : idx)
                        }
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenuIdx === idx && (
                        <div className="action-dropdown">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              onApplyPriceToKarat(
                                product.karatType,
                                product.pricePerGram,
                              );
                              setOpenMenuIdx(null);
                            }}
                          >
                            <FaClone />
                            Apply to all {product.karatType}K
                          </button>
                          <button
                            className="dropdown-item danger"
                            onClick={() => {
                              handleRemoveProduct(idx);
                              setOpenMenuIdx(null);
                            }}
                          >
                            <FaTimes />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={8} style={{ textAlign: "center", padding: "12px 0" }}>
              <button
                className="manual-entry-btn"
                id="manualEntryBtn"
                onClick={() => setShowAddProductModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: "var(--dark)",
                }}
                title="Add product"
              >
                <FaPlusCircle />
              </button>
            </td>
          </tr>
        </tfoot>
      </table>

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
