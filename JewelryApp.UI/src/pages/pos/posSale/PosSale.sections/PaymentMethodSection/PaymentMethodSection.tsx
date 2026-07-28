import { FaCreditCard, FaMoneyBillWave, FaRandom } from "react-icons/fa";
import "./paymentMethodSection.scss";
import type { PayMethod } from "./PaymentMethodSection.type";

interface Props {
  payMethod: PayMethod;
  onPayMethodChange: (method: PayMethod) => void;
  cashAmount: number;
  cardAmount: number;
  total: number;
  setCashAmount: (n: number) => void;
  setCardAmount: (n: number) => void;
  onCashInputChange: (value: string) => void;
  onCardInputChange: (value: string) => void;
}

const PaymentMethodSection: React.FC<Props> = ({
  payMethod,
  onPayMethodChange,
  cashAmount,
  cardAmount,
  total,
  setCashAmount,
  setCardAmount,
  onCashInputChange,
  onCardInputChange,
}) => {
  const selectMethod = (method: PayMethod) => {
    onPayMethodChange(method);
    if (method === "cash") {
      setCashAmount(parseFloat(total.toFixed(4)));
      setCardAmount(0);
    } else if (method === "card") {
      setCardAmount(parseFloat(total.toFixed(4)));
      setCashAmount(0);
    }
  };

  return (
    <section className="ps-panel ps-payment-panel">
      <h2 className="ps-panel-label">Payment</h2>

      <div className="ps-pay-tabs">
        <button
          type="button"
          className={`ps-pay-tab${payMethod === "cash" ? " sel-cash" : ""}`}
          onClick={() => selectMethod("cash")}
        >
          <FaMoneyBillWave className="ps-pt-ico" />
          <span className="ps-pt-lbl">Cash</span>
        </button>
        <button
          type="button"
          className={`ps-pay-tab${payMethod === "card" ? " sel-card" : ""}`}
          onClick={() => selectMethod("card")}
        >
          <FaCreditCard className="ps-pt-ico" />
          <span className="ps-pt-lbl">Card</span>
        </button>
        <button
          type="button"
          className={`ps-pay-tab${payMethod === "split" ? " sel-split" : ""}`}
          onClick={() => selectMethod("split")}
        >
          <FaRandom className="ps-pt-ico" />
          <span className="ps-pt-lbl">Split</span>
        </button>
      </div>

      <div className="ps-pay-fields">
        <div className="ps-pf">
          <label>Cash</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="$0.00"
            value={cashAmount}
            disabled={payMethod === "card"}
            onChange={(e) => onCashInputChange(e.target.value)}
          />
        </div>
        <div className="ps-pf">
          <label>Card</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="$0.00"
            value={cardAmount}
            disabled={payMethod === "cash"}
            onChange={(e) => onCardInputChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodSection;
