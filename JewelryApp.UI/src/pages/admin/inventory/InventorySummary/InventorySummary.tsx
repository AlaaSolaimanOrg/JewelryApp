import { safeValue } from "../../../../utils";
import "./inventorySummary.scss";
import type { InventorySummaryProps } from "./InventorySummary.type";

const fmtCurrency = (value: number): string =>
  `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const InventorySummary = ({ summary }: InventorySummaryProps) => {
  const totalProducts = safeValue(summary?.totalProducts, 0);
  const totalQuantity = safeValue(summary?.totalQuantity, 0);
  const totalWeight = safeValue(summary?.totalWeight, 0);
  const totalValue = safeValue(summary?.totalValue, 0);

  return (
    <div className="sum-strip">
      <span className="sum-item">
        <b>{totalProducts.toLocaleString()}</b> products found
      </span>
      <span className="sum-item">
        <b>{totalQuantity.toLocaleString()}</b> pieces
      </span>
      <span className="sum-item">
        <b>
          {totalWeight.toLocaleString("en-US", { maximumFractionDigits: 1 })}g
        </b>{" "}
        total weight
      </span>
      <span className="sum-item">
        <b>{fmtCurrency(totalValue)}</b> stock value
      </span>
    </div>
  );
};

export default InventorySummary;
