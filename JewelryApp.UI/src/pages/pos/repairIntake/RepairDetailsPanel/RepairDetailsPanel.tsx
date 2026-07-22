import {
  FaBan,
  FaColumns,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import { RepairPayMethod } from "../../../../types/enums";
import { formatCurrency } from "../RepairIntake.utils";
import "./repairDetailsPanel.scss";

interface RepairDetailsPanelProps {
  notes: string;
  onNotesChange: (value: string) => void;
  cost: string;
  onCostChange: (value: string) => void;
  payMethod: RepairPayMethod;
  onPayMethodChange: (method: RepairPayMethod) => void;
  cashAmount: string;
  onCashAmountChange: (value: string) => void;
  cardAmount: string;
  onCardAmountChange: (value: string) => void;
}

const RepairDetailsPanel = ({
  notes,
  onNotesChange,
  cost,
  onCostChange,
  payMethod,
  onPayMethodChange,
  cashAmount,
  onCashAmountChange,
  cardAmount,
  onCardAmountChange,
}: RepairDetailsPanelProps) => {
  const costValue = parseFloat(cost) || 0;
  const cashValue = parseFloat(cashAmount) || 0;
  const cardValue = parseFloat(cardAmount) || 0;

  let payStatus: { type: "ok" | "partial"; text: string } | null = null;
  if (payMethod === RepairPayMethod.Unpaid) {
    if (costValue > 0) {
      payStatus = {
        type: "partial",
        text: `Unpaid — ${formatCurrency(costValue)} due at pickup`,
      };
    }
  } else if (payMethod === RepairPayMethod.Split) {
    const paid = cashValue + cardValue;
    const remaining = costValue - paid;
    payStatus =
      Math.abs(remaining) < 0.01
        ? {
            type: "ok",
            text: `Fully paid — split ${formatCurrency(cashValue)} cash / ${formatCurrency(cardValue)} card`,
          }
        : {
            type: "partial",
            text: `${formatCurrency(Math.abs(remaining))} ${remaining > 0 ? "remaining" : "overpaid"}`,
          };
  } else if (costValue > 0) {
    payStatus = {
      type: "ok",
      text: `Paid in full — ${payMethod === RepairPayMethod.Cash ? "cash" : "card"}`,
    };
  }

  return (
    <div className="ri-left">
      <div className="ri-panel ri-notes-panel">
        <div className="ri-panel-label">Repair notes *</div>
        <textarea
          className="ri-notes-ta"
          placeholder={
            "Ring to size 7 (weight 6.34)\nWeld Bracelet (weight 14.8)\nChain solder + replace spring ring"
          }
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
        <div className="ri-notes-hint">Printed directly on the receipt</div>
      </div>

      <div className="ri-panel">
        <div className="ri-panel-label">Pricing</div>
        <div className="ri-fg">
          <label>Cost ($)</label>
          <input
            type="number"
            step="1"
            min="0"
            value={cost}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              onCostChange(Math.trunc(Number(e.target.value)).toString())
            }
            onKeyDown={(e) => {
              if (e.key === "." || e.key === ",") e.preventDefault();
              if (
                !/[^0-9]/.test(e.key) &&
                e.currentTarget.value.replace("-", "").length >= 8
              )
                e.preventDefault();
            }}
          />
        </div>

        <div className="ri-panel-label ri-payment-label">Payment</div>
        <div className="ri-pay-tabs">
          <div
            className={`ri-pay-tab ${payMethod === RepairPayMethod.Unpaid ? "sel-unpaid" : ""}`}
            onClick={() => onPayMethodChange(RepairPayMethod.Unpaid)}
          >
            <FaBan className="ri-pt-ico" />
            <span className="ri-pt-lbl">Unpaid</span>
          </div>
          <div
            className={`ri-pay-tab ${payMethod === RepairPayMethod.Cash ? "sel-cash" : ""}`}
            onClick={() => onPayMethodChange(RepairPayMethod.Cash)}
          >
            <FaMoneyBillWave className="ri-pt-ico" />
            <span className="ri-pt-lbl">Cash</span>
          </div>
          <div
            className={`ri-pay-tab ${payMethod === RepairPayMethod.Card ? "sel-card" : ""}`}
            onClick={() => onPayMethodChange(RepairPayMethod.Card)}
          >
            <FaCreditCard className="ri-pt-ico" />
            <span className="ri-pt-lbl">Card</span>
          </div>
          <div
            className={`ri-pay-tab ${payMethod === RepairPayMethod.Split ? "sel-split" : ""}`}
            onClick={() => onPayMethodChange(RepairPayMethod.Split)}
          >
            <FaColumns className="ri-pt-ico" />
            <span className="ri-pt-lbl">Split</span>
          </div>
        </div>

        {payMethod !== RepairPayMethod.Unpaid && (
          <div className="ri-pay-fields">
            <div className="ri-pf">
              <label>Cash</label>
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={cashAmount}
                disabled={payMethod === RepairPayMethod.Card}
                onChange={(e) => onCashAmountChange(e.target.value)}
              />
            </div>
            <div className="ri-pf">
              <label>Card</label>
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={cardAmount}
                disabled={payMethod === RepairPayMethod.Cash}
                onChange={(e) => onCardAmountChange(e.target.value)}
              />
            </div>
          </div>
        )}

        {payStatus && (
          <div className={`ri-pay-status ri-pay-${payStatus.type}`}>
            {payStatus.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairDetailsPanel;
