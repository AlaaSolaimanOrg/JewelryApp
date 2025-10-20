import {
  FaCreditCard,
  FaPlus,
  FaRing,
  FaShoppingCart,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  deleteCart,
  getCartProducts,
  removeProductFromCart,
} from "../../../apis/cart.api/cart.api";
import type { TableHeader } from "../../../components/Table/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./cartSummary.scss";

export interface CartProduct {
  productId: string;
  sku: string;
  name: string;
  karatType: number;
  weight: number;
  pricePerGram: number;
}

const CartSummary = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { totalDiscount } = location.state || { totalDiscount: 0 };

  const { data: cartProducts, fetchData: recallGetCartProducts } = useLocalApi({
    apiToCall: (data) => getCartProducts(data.payload),
  }) as {
    data: CartProduct[];
    fetchData: any;
    setData: any;
  };

  // Calculate subtotal, tax, and total
  const subtotal =
    cartProducts?.reduce(
      (sum, item) => sum + item.weight * item.pricePerGram,
      0
    ) || 0;
  const tax = subtotal * 0.05; // Example: 5% tax
  const total = subtotal - totalDiscount + tax;

  const handleCancelSale = () => {
    deleteCart()
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          navigate("/productLookup");
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };
  const handleRemoveProductFromCart = (productId) => {
    const payload = {
      productId: productId,
    };
    removeProductFromCart(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          if (cartProducts.length == 1) {
            return navigate("/productLookup");
          }
          recallGetCartProducts();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  const headers: TableHeader[] = [
    { key: "product", label: "Product", width: "200px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "weight", label: "Weight", width: "100px" },
    { key: "pricePerGram", label: "Price/Gram", width: "120px" },
    { key: "subtotal", label: "Subtotal", width: "150px" },
    { key: "actions", label: "", width: "100px" }, // usually for buttons/icons
  ];

  function renderCartTableHeader() {
    return (
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header.label}</th>
        ))}
      </tr>
    );
  }

  function renderCartTableRows(cartProducts: CartProduct[]) {
    if (!cartProducts || cartProducts.length === 0) {
      return (
        <tr>
          <td colSpan={headers.length} style={{ textAlign: "center" }}>
            No products in cart.
          </td>
        </tr>
      );
    }
    return cartProducts.map((product) => (
      <tr key={product.productId}>
        <td className="item-name">
          <FaRing className="productIcon" />
          {product.name}
        </td>
        <td>{product.karatType}K</td>
        <td>{product.weight}g</td>
        <td>${product.pricePerGram.toFixed(2)}</td>
        <td>${(product.weight * product.pricePerGram).toFixed(2)}</td>
        <td className="item-actions">
          <button
            onClick={() => handleRemoveProductFromCart(product.productId)}
          >
            <FaTimes />
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="cartSummary page-content">
      <h2 className="title">
        <FaShoppingCart /> Cart Summary
      </h2>
      <p className="subtitle">Review items before payment</p>

      <div className="cart-container">
        <div>
          <table className="cart-table">
            <thead>{renderCartTableHeader()}</thead>
            <tbody>{renderCartTableRows(cartProducts)}</tbody>
          </table>

          <Link to={"/applyDiscount"} className="text-decoration-none">
            <button className="btn btn-secondary">
              <FaTag /> Apply Discount
            </button>
          </Link>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Discount:</span>
            <span>${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <button
              className="btn btn-primary w-100"
              disabled={!cartProducts.length}
              onClick={() => {
                navigate("/payment", {
                  state: { totalDiscount, total, tax },
                  replace: true,
                });
              }}
            >
              <FaCreditCard /> Proceed to Payment
            </button>

            <button
              className="btn btn-secondary w-100"
              onClick={handleCancelSale}
              disabled={!cartProducts.length}
            >
              <FaTimes /> Cancel Sale
            </button>

            <Link to={"/productLookup"} className="text-decoration-none">
              <button className="btn btn-secondary w-100">
                <FaPlus /> Add More Items
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
