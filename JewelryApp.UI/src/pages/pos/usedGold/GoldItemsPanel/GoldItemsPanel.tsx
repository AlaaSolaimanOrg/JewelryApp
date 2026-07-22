import { FaPlus, FaTimes } from "react-icons/fa";
import type { GoldRow } from "../UsedGold.type";
import { formatCurrency, getKaratColor } from "../UsedGold.utils";
import "./goldItemsPanel.scss";

interface GoldItemsPanelProps {
  rows: GoldRow[];
  onWeightChange: (id: number, value: string) => void;
  onPriceChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  onAddClick: () => void;
}

const GoldItemsPanel = ({
  rows,
  onWeightChange,
  onPriceChange,
  onRemove,
  onAddClick,
}: GoldItemsPanelProps) => {
  const activeCount = rows.filter((r) => r.weight > 0).length;
  const totalWeight = rows.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="ug-gold-box">
      <div className="ug-gold-header">
        <span className="ug-gold-title">Gold items</span>
        <span className="ug-gold-count">
          {activeCount} item{activeCount !== 1 ? "s" : ""} ·{" "}
          {totalWeight.toFixed(2)}g
        </span>
      </div>

      <div className="ug-gold-cols">
        <span className="ug-col-lbl">Karat</span>
        <span className="ug-col-lbl center">Weight (g)</span>
        <span className="ug-col-lbl center">$/gram</span>
        <span className="ug-col-lbl right">Subtotal</span>
        <span></span>
      </div>

      <div className="ug-gold-items">
        {rows.map((row) => {
          const subtotal = row.weight * row.pricePerGram;
          const color = getKaratColor(row.karat);

          return (
            <div className="ug-gold-row" key={row.id}>
              <div
                className="ug-gr-karat"
                style={{ background: color.bg, color: color.text }}
              >
                {row.karat}K
              </div>
              <input
                className="ug-gr-input"
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={row.weight || ""}
                onChange={(e) => onWeightChange(row.id, e.target.value)}
              />
              <input
                className="ug-gr-input"
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={row.pricePerGram || ""}
                onChange={(e) => onPriceChange(row.id, e.target.value)}
              />
              <div
                className={`ug-gr-sub ${subtotal > 0 ? "has-val" : "empty"}`}
              >
                {formatCurrency(subtotal)}
              </div>
              <button
                className="ug-gr-remove"
                onClick={() => onRemove(row.id)}
              >
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>

      <div className="ug-gold-footer">
        <button className="ug-btn ug-btn-outline" onClick={onAddClick}>
          <FaPlus /> Add karat row
        </button>
      </div>
    </div>
  );
};

export default GoldItemsPanel;
