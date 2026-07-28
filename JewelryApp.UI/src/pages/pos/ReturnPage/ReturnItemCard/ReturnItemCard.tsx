import { FaCheck, FaGem } from "react-icons/fa";
import { GiRing } from "react-icons/gi";
import { ItemCondition, ReturnOption, ReturnReason } from "../../../../types/enums";
import type { TransactionItem } from "../ReturnPage.type";
import { formatCurrency } from "../ReturnPage.utils";
import "./returnItemCard.scss";

interface ReturnItemCardProps {
  item: TransactionItem;
  onToggle: (id: string) => void;
  onQuantityChange: (id: string, value: string) => void;
  onQuantityBlur: (id: string) => void;
  onAmountChange: (id: string, value: string) => void;
  onReasonChange: (id: string, value: ReturnReason | null) => void;
  onOtherReasonChange: (id: string, value: string) => void;
  onConditionChange: (id: string, value: ItemCondition) => void;
  onDestinationChange: (id: string, value: ReturnOption) => void;
}

const REASONS: { value: ReturnReason; label: string }[] = [
  { value: ReturnReason.NotAsExpected, label: "Not as expected" },
  { value: ReturnReason.WrongSize, label: "Wrong size" },
  { value: ReturnReason.Defective, label: "Defective" },
  { value: ReturnReason.GiftReturn, label: "Gift return" },
  { value: ReturnReason.Other, label: "Other" },
];

const CONDITIONS: { value: ItemCondition; label: string }[] = [
  { value: ItemCondition.Good, label: "Good" },
  { value: ItemCondition.NeedsPolishing, label: "Needs polish" },
  { value: ItemCondition.Damaged, label: "Damaged" },
];

const ReturnItemCard = ({
  item,
  onToggle,
  onQuantityChange,
  onQuantityBlur,
  onAmountChange,
  onReasonChange,
  onOtherReasonChange,
  onConditionChange,
  onDestinationChange,
}: ReturnItemCardProps) => {
  const isReturnable = item.qtyPurchased > 0;
  const qtyLabel = item.qtyPurchased > 1 ? ` (×${item.qtyPurchased})` : "";
  const totalPrice = item.unitPrice * item.qtyPurchased;

  return (
    <div
      className={`rp-item-card ${item.selected ? "active" : ""} ${!isReturnable ? "disabled" : ""}`}
    >
      <div
        className="rp-item-top"
        onClick={() => isReturnable && onToggle(item.id)}
      >
        <div className="rp-item-cb">{isReturnable && <FaCheck />}</div>
        <div className="rp-item-icon">
          {item.productImage ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${item.productImage}`}
              alt={item.name}
            />
          ) : item.icon === "ring" ? (
            <GiRing />
          ) : (
            <FaGem />
          )}
        </div>
        <div className="rp-item-info">
          <div className="rp-item-name">
            {item.name}
            {qtyLabel}
          </div>
          <div className="rp-item-meta">
            {item.karat}K · {item.weight}
            {item.quantityReturned > 0
              ? ` · ${item.quantityReturned} already returned`
              : ""}
          </div>
        </div>
        {isReturnable ? (
          <div className="rp-item-price">{formatCurrency(totalPrice)}</div>
        ) : (
          <span className="rp-item-returned-badge">Fully returned</span>
        )}
      </div>

      {isReturnable && (
        <div className="rp-item-expand">
          <div
            className="rp-item-expand-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rp-fields-row">
              <div>
                <div className="rp-field-label">Reason</div>
                <select
                  className="rp-field-select"
                  value={item.returnReason ?? ""}
                  onChange={(e) =>
                    onReasonChange(
                      item.id,
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="">Select reason</option>
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {item.returnReason === ReturnReason.Other && (
                  <textarea
                    className="rp-other-reason"
                    placeholder="Please specify the reason..."
                    value={item.otherReason}
                    onChange={(e) => onOtherReasonChange(item.id, e.target.value)}
                  />
                )}
              </div>
              <div>
                <div className="rp-field-label">Condition</div>
                <div className="rp-pills">
                  {CONDITIONS.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      className={`rp-pill ${item.condition === c.value ? "sel" : ""}`}
                      onClick={() => onConditionChange(item.id, c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rp-dest-row">
              <div
                className={`rp-dest-btn ${item.returnOption === ReturnOption.ReturnToStock ? "sel" : ""}`}
                onClick={() => onDestinationChange(item.id, ReturnOption.ReturnToStock)}
              >
                <span className="rp-dest-lbl">Return to stock</span>
                <span className="rp-dest-sub">Available for sale</span>
              </div>
              <div
                className={`rp-dest-btn ${item.returnOption === ReturnOption.MeltAfterReturn ? "sel" : ""}`}
                onClick={() => onDestinationChange(item.id, ReturnOption.MeltAfterReturn)}
              >
                <span className="rp-dest-lbl">Melt</span>
                <span className="rp-dest-sub">Recover materials</span>
              </div>
            </div>

            <div className="rp-qty-row">
              <span className="rp-qty-label">Qty to return</span>
              <input
                type="number"
                className="rp-qty-input"
                value={item.qtyToReturn}
                min={0}
                max={item.qtyPurchased}
                onChange={(e) => onQuantityChange(item.id, e.target.value)}
                onBlur={() => onQuantityBlur(item.id)}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <span className="rp-qty-ctx">of {item.qtyPurchased} purchased</span>
              <input
                type="number"
                className="rp-qty-amt"
                value={item.returnAmount}
                min={0}
                step="0.01"
                onChange={(e) => onAmountChange(item.id, e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnItemCard;
