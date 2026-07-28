import { useNavigate } from "react-router-dom";
import "./paymentSummary.scss";

interface Props {
  subtotal: number;
  discount: number;
  tradeInCredit: number;
  exchangeCredit: number;
  rawTotal: number;
  handleCreateSale: () => void;
  canSaveSale: boolean;
}

const formatAmount = (value: number) => {
  return Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const PaymentSummary: React.FC<Props> = ({
  subtotal,
  discount,
  tradeInCredit,
  exchangeCredit,
  rawTotal,
  handleCreateSale,
  canSaveSale,
}) => {
  const navigate = useNavigate();
  const total = Math.max(0, rawTotal);
  const hasCredit = tradeInCredit > 0 || exchangeCredit > 0;

  return (
    <>
      <section className="ps-panel ps-sum-panel">
        <h2 className="ps-panel-label">Summary</h2>
        <div className="ps-sum-row">
          <span>Subtotal</span>
          <span>${formatAmount(subtotal)}</span>
        </div>
        {tradeInCredit > 0 && (
          <div className="ps-sum-row">
            <span>Trade-in credit</span>
            <span className="ps-sum-trade">−${formatAmount(tradeInCredit)}</span>
          </div>
        )}
        {exchangeCredit > 0 && (
          <div className="ps-sum-row">
            <span>Exchange credit</span>
            <span className="ps-sum-exch">−${formatAmount(exchangeCredit)}</span>
          </div>
        )}
        <div className="ps-sum-row">
          <span>Discount</span>
          <span className="ps-sum-disc">−${formatAmount(discount)}</span>
        </div>
        <div className="ps-sum-total">
          <span>{rawTotal < 0 ? "Total" : "Customer pays"}</span>
          <span className="ps-sum-total-price">${formatAmount(total)}</span>
        </div>
        {rawTotal < 0 && (
          <div className="ps-sum-overflow">
            <span>Cash owed to customer</span>
            <span>${formatAmount(rawTotal)}</span>
          </div>
        )}
        {rawTotal === 0 && hasCredit && (
          <div className="ps-sum-even">Even exchange — no payment needed</div>
        )}
      </section>

      <button
        className="ps-save-btn"
        disabled={!canSaveSale}
        onClick={handleCreateSale}
      >
        {canSaveSale ? `Save sale — $${formatAmount(total)}` : "Save Sale"}
      </button>
      <div className="ps-cancel-link" onClick={() => navigate("/")}>
        Cancel
      </div>
    </>
  );
};

export default PaymentSummary;
