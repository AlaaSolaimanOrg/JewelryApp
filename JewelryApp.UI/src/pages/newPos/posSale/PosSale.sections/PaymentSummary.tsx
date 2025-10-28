import { useNavigate } from "react-router-dom";

interface Props {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  handleCreateSale: () => void;
  canSaveSale: boolean;
}

const PaymentSummary: React.FC<Props> = ({
  subtotal,
  discount,
  tax,
  total,
  handleCreateSale,
  canSaveSale,
}) => {
  const navigate = useNavigate();
  return (
    <section className="payment-section">
      <h2 className="section-title">Payment</h2>
      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(4)}</span>
        </div>
        <div className="summary-row">
          <span>Discount:</span>
          <span>${discount.toFixed(4)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>${tax.toFixed(4)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${total.toFixed(4)}</span>
        </div>
      </div>

      <div className="footer-buttons">
        <button
          className={`save-btn ${!canSaveSale ? "disabled-button-gold" : ""}`}
          disabled={!canSaveSale}
          onClick={() => {
            handleCreateSale();
          }}
        >
          Save Sale
        </button>
        <button
          className="cancel-btn"
          onClick={() => {
            navigate("/");
          }}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default PaymentSummary;
