import { FaPlusCircle, FaTimes } from "react-icons/fa";
import type { Product } from "../../types";
import { KaratType } from "../../../../../types/enums";
import "./productsSection.scss";

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
  return (
    <section className="products-section">
      <h2 className="section-title">Cart Summary</h2>

      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>karat</th>
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
                  {!product.manual && (
                    <img
                      className="product-image"
                      src={`${import.meta.env.VITE_API_URL}${
                        product.images[0]?.imageUrl
                      }`}
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
                    const subtotal =
                      parseFloat(product.pricePerGram?.toString() ?? "0") *
                      parseFloat(product.weight?.toString() ?? "0");
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
            <td colSpan={7} style={{ textAlign: "center", padding: "12px 0" }}>
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
