import { FaPlusCircle, FaTimes } from "react-icons/fa";
import type { Product } from "../../types";
import { KaratType } from "../../../../../types/enums";
import "./productsSection.scss";
import preventSignOnKeyDown from "../../../../../utils";

interface Props {
  products: Product[];
  handleManualEntry: () => void;
  handleRemoveProduct: (idx: number) => void;
  handleManualProductChange: (idx: number, field: string, value: any) => void;
}

const ProductsSection: React.FC<Props> = ({
  products,
  handleManualEntry,
  handleRemoveProduct,
  handleManualProductChange,
}) => {
  
  const handleQuantityChange = (idx: number, value: string) => {
    // Prevent negative numbers and ensure it's a valid number
    const numValue = Math.max(0, parseInt(value) || 0);
    
    // Ensure quantity doesn't exceed available stock for non-manual products
    if (!products[idx].manual && numValue > products[idx].quantity) {
      return; // Don't update if exceeding available quantity
    }
    
    handleManualProductChange(idx, "quantityForSale", numValue);
  };

  console.log("products",products)

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="productsTableBody">
          {products?.map((product, idx) => (
            <tr key={idx} className={product.manual ? "manual-row" : ""}>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {!product.manual && product.images?.[0] && (
                    <img
                      className="product-image"
                      src={`${import.meta.env.VITE_API_URL}${
                        product.images[0]?.imageUrl
                      }`}
                      alt={product.name}
                    />
                  )}
                  <div style={{ marginLeft: "10px" }}>
                    {product.manual ? (
                      <input
                        type="text"
                        className="product-name-input"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={(e) =>
                          handleManualProductChange(idx, "name", e.target.value)
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </div>
                </div>
              </td>
              <td>
                {product.manual ? (
                  <select
                    value={product.karatType as any}
                    onChange={(e) =>
                      handleManualProductChange(
                        idx,
                        "karatType",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                    }}
                  >
                    <option value={KaratType.Karat18}>18K</option>
                    <option value={KaratType.Karat21}>21K</option>
                    <option value={KaratType.Karat22}>22K</option>
                    <option value={KaratType.Karat24}>24K</option>
                  </select>
                ) : (
                  product.karatType
                )}
              </td>
              <td>
                <input
                  type="number"
                  className="weight-input"
                  placeholder="Qty"
                  value={product.quantityForSale || 0}
                  min="1"
                  max={product.manual ? undefined : product.quantity}
                  onKeyDown={preventSignOnKeyDown}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  style={{ width: "70px" }}
                />
                {!product.manual && product.quantityForSale > product.quantity && (
                  <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    Exceeds available stock
                  </div>
                )}
              </td>
              <td>{product.quantity}</td>
              <td>
                <input
                  type="text"
                  className="weight-input"
                  placeholder={product.manual ? "0.0g" : ""}
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
                  placeholder={product.manual ? "$0.00" : ""}
                  value={product.pricePerGram as any}
                  onChange={(e) =>
                    handleManualProductChange(
                      idx,
                      "pricePerGram",
                      e.target.value
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
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveProduct(idx)}
                >
                  <FaTimes />
                </button>
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
                onClick={handleManualEntry}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: "var(--primary-blue)",
                }}
                title="Add manual entry"
              >
                <FaPlusCircle />
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};

export default ProductsSection;