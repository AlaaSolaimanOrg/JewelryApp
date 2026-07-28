import type { TransactionItem } from "../ReturnPage.type";
import { formatCurrency, isSelectionValid } from "../ReturnPage.utils";
import "./refundSummaryPanel.scss";

interface RefundSummaryPanelProps {
  items: TransactionItem[];
  onSubmit: () => void;
}

const RefundSummaryPanel = ({ items, onSubmit }: RefundSummaryPanelProps) => {
  const selectedItems = items.filter((i) => i.selected && i.qtyToReturn > 0);
  const total = selectedItems.reduce((sum, i) => sum + i.returnAmount, 0);
  const allValid = selectedItems.length > 0 && selectedItems.every(isSelectionValid);

  return (
    <div className="rp-panel rp-summary-panel">
      <div className="rp-panel-label">Refund summary</div>
      {!selectedItems.length ? (
        <div className="rp-summary-empty">No items selected</div>
      ) : (
        <>
          {selectedItems.map((item) => (
            <div className="rp-summary-line" key={item.id}>
              <span>
                {item.name}
                {item.qtyToReturn > 1 ? ` (×${item.qtyToReturn})` : ""}
              </span>
              <span>{formatCurrency(item.returnAmount)}</span>
            </div>
          ))}
          <hr className="rp-summary-divider" />
          <div className="rp-summary-total">
            <span>Refund total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {!allValid && (
            <div className="rp-validation-msg">
              Fill in reason, condition, and return option for all selected items
            </div>
          )}
        </>
      )}
      <button
        className="rp-save-btn"
        disabled={!selectedItems.length || !allValid}
        onClick={onSubmit}
      >
        {!selectedItems.length
          ? "Select items to return"
          : allValid
            ? `Process return — ${formatCurrency(total)}`
            : "Complete all fields to continue"}
      </button>
    </div>
  );
};

export default RefundSummaryPanel;
