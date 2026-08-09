import "./karatPriceCard.scss";
import { fmtWeight } from "../../../pages/admin/pricing/Pricing.utils";
import preventSignOnKeyDown from "../../../utils";
import type { KaratPriceCardProps } from "./KaratPriceCard.type";

const KaratPriceCard = ({
  karatLabel,
  stockGrams,
  price,
  changed,
  deltaDirection,
  deltaText,
  onChange,
}: KaratPriceCardProps) => {
  return (
    <div className={`karatPriceCard ${changed ? "changed" : ""}`}>
      <div className="pcard-top">
        <span className="pcard-karat">{karatLabel}</span>
        <span className="pcard-stock">{fmtWeight(stockGrams)} in stock</span>
      </div>
      <div className="pcard-input-row">
        <span className="pcard-cur">$</span>
        <input
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          step="0.01"
          min={0}
          value={price ?? ""}
          onKeyDown={preventSignOnKeyDown}
          onChange={(event) => {
            const value = event.target.value;
            onChange(value ? Number(value) : null);
          }}
        />
        <span className="pcard-cur">/g</span>
      </div>
      <div className={`pcard-delta d-${deltaDirection}`}>{deltaText}</div>
    </div>
  );
};

export default KaratPriceCard;
