import { useEffect, useState } from "react";
import { FaCheck, FaRing, FaTag, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getCartProducts } from "../../../apis/cart.api/cart.api";
import type { TableHeader } from "../../../components/Table/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import { OrderDiscount } from "../../../types/enums";
import type { CartProduct } from "../cartSummary/CartSummary";
import "./applyDiscount.scss";

interface EditableCartProduct {
  productId: string;
  name: string;
  weight: number;
  originalPricePerGram: number;
  originalSubtotal: number;
  pricePerGram: number;
  subtotal: number;
}

const ApplyDiscount = () => {
  const navigate = useNavigate();
  const [orderDiscountType, setOrderDiscountType] = useState<OrderDiscount>(
    OrderDiscount.Percentage
  );
  const [orderDiscountValue, setOrderDiscountValue] = useState<number>(0);

  const { data: cartProducts } = useLocalApi({
    apiToCall: (data) => getCartProducts(data.payload),
  }) as {
    data: CartProduct[];
  };

  const [editableProducts, setEditableProducts] = useState<
    EditableCartProduct[]
  >([]);

  // Initialize local editable copy when cartProducts changes
  useEffect(() => {
    if (cartProducts) {
      const copy = cartProducts.map((p) => {
        const subtotal = p.weight * p.pricePerGram;
        return {
          productId: p.productId,
          name: p.name,
          weight: p.weight,
          originalPricePerGram: p.pricePerGram,
          originalSubtotal: subtotal,
          pricePerGram: p.pricePerGram,
          subtotal: subtotal,
        };
      });
      setEditableProducts(copy);
    }
  }, [cartProducts]);

  // Handle input changes
  const handlePriceChange = (
    id: string,
    value: number,
    originalPricePerGram: number
  ) => {
    const decimalValue = Number(value.toFixed(2));
    if (decimalValue <= originalPricePerGram) {
      setEditableProducts((prev) =>
        prev.map((p) =>
          p.productId === id
            ? {
                ...p,
                pricePerGram: decimalValue,
                subtotal: Number((p.weight * decimalValue).toFixed(2)),
              }
            : p
        )
      );
    }
  };

  const handleSubtotalChange = (
    id: string,
    value: number,
    originalSubtotal: number
  ) => {
    const decimalValue = Number(value.toFixed(2));
    if (decimalValue <= originalSubtotal) {
      setEditableProducts((prev) =>
        prev.map((p) =>
          p.productId === id
            ? {
                ...p,
                subtotal: decimalValue,
                pricePerGram: Number((decimalValue / p.weight).toFixed(2)),
              }
            : p
        )
      );
    }
  };

  // Table headers
  const headers: TableHeader[] = [
    { key: "product", label: "Product", width: "200px" },
    { key: "weight", label: "Weight (g)", width: "120px" },
    { key: "pricePerGram", label: "Price/Gram", width: "120px" },
    { key: "subtotal", label: "Subtotal", width: "150px" },
  ];

  function renderTableHeader() {
    return (
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header.label}</th>
        ))}
      </tr>
    );
  }

  function renderTableRows() {
    if (!editableProducts || editableProducts.length === 0) {
      return (
        <tr>
          <td colSpan={headers.length} style={{ textAlign: "center" }}>
            No products in cart.
          </td>
        </tr>
      );
    }

    return editableProducts.map((product) => (
      <tr key={product.productId}>
        <td className="item-name">
          <FaRing className="color-gold" />
          {product.name}
        </td>
        <td>{product.weight}</td>
        <td>
          <input
            type="number"
            value={product.pricePerGram === 0 ? "" : product.pricePerGram}
            step="0.01"
            min={0}
            max={product.originalPricePerGram}
            style={{ width: "120px" }}
            onChange={(e) =>
              handlePriceChange(
                product.productId,
                Number(e.target.value),
                product.originalPricePerGram
              )
            }
          />
        </td>
        <td>
          <input
            type="number"
            value={product.subtotal === 0 ? "" : product.subtotal}
            step="0.01"
            min={0}
            max={product.originalSubtotal}
            style={{ width: "120px" }}
            onChange={(e) =>
              handleSubtotalChange(
                product.productId,
                Number(e.target.value),
                product.originalSubtotal
              )
            }
          />
        </td>
      </tr>
    ));
  }

  // Totals
  const originalTotal =
    editableProducts.reduce((sum, p) => sum + p.originalSubtotal, 0) || 0;
  const itemTotal =
    editableProducts.reduce((sum, p) => sum + p.subtotal, 0) || 0;

  // Calculate order-level discount
  let orderDiscountAmount = 0;
  if (orderDiscountType === OrderDiscount.Percentage) {
    orderDiscountAmount = (itemTotal * orderDiscountValue) / 100;
  } else {
    orderDiscountAmount = orderDiscountValue;
    if (orderDiscountAmount > itemTotal) orderDiscountAmount = itemTotal; // prevent negative
  }

  const newTotal = itemTotal - orderDiscountAmount;
  const itemDiscounts = originalTotal - itemTotal;

  const anyProductHasNoValue = editableProducts.some(
    (editableProduct) =>
      !editableProduct.pricePerGram || !editableProduct.subtotal
  );

  const handleApplyDiscount = () => {
    const totalDiscount = itemDiscounts + orderDiscountAmount;

    navigate("/cartSummary", { state: { totalDiscount }, replace: true });
  };
  return (
    <div className="page-content applyDiscount">
      <h2>
        <FaTag /> Apply Discount
      </h2>
      <p className="subtitle">Adjust pricing for items or entire order</p>

      <div className="cart-container">
        <div>
          <table className="cart-table">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>

          <div style={{ marginTop: "30px" }}>
            <h3>Order-Level Discount</h3>
            <div className="detail-row">
              <div className="detail-item">
                <label>Discount Type</label>
                <select
                  value={orderDiscountType}
                  onChange={(e) => {
                    setOrderDiscountType(Number(e.target.value));
                    setOrderDiscountValue(0);
                  }}
                >
                  <option value={OrderDiscount.Percentage}>Percentage</option>
                  <option value={OrderDiscount.FixedAmount}>
                    Fixed Amount
                  </option>
                </select>
              </div>
              <div className="detail-item">
                <label>Discount Value</label>
                <input
                  type="number"
                  value={orderDiscountValue}
                  step="0.01"
                  min={0}
                  max={
                    orderDiscountType === OrderDiscount.Percentage
                      ? 100
                      : itemTotal // Fixed amount cannot exceed item total
                  }
                  onChange={(e) => {
                    let value = Number(e.target.value);

                    // Clamp for Percentage
                    if (
                      orderDiscountType === OrderDiscount.Percentage &&
                      value > 100
                    ) {
                      value = 100;
                    }

                    // Clamp for Fixed Amount
                    if (
                      orderDiscountType === OrderDiscount.FixedAmount &&
                      value > itemTotal
                    ) {
                      value = itemTotal;
                    }

                    setOrderDiscountValue(value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <h3>Discount Summary</h3>

          <div className="summary-item">
            <span>Original Total:</span>
            <span>${originalTotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Item Discounts:</span>
            <span>${itemDiscounts.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Order Discount:</span>
            <span>${orderDiscountAmount.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>New Total:</span>
            <span>${newTotal.toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <button
              className="btn btn-primary"
              disabled={anyProductHasNoValue || originalTotal == newTotal}
              onClick={handleApplyDiscount}
            >
              <FaCheck /> Apply Discount
            </button>

            <Link to={"/cartSummary"} className="text-decoration-none">
              <button className="btn btn-secondary w-100">
                <FaTimes /> Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyDiscount;
