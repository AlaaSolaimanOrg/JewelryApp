import React from "react";

interface Props {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const PaymentSummary: React.FC<Props> = ({
  subtotal,
  discount,
  tax,
  total,
}) => {
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
        <button className="save-btn">Save Sale</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </section>
  );
};

export default PaymentSummary;
