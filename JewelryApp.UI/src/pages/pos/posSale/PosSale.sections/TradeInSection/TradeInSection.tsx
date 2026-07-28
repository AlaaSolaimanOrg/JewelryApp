import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import "./tradeInSection.scss";
import type { TradeInRow } from "./TradeInSection.type";
import {
  createDefaultTradeInRows,
  getActiveTradeInRows,
  getKaratColor,
  getTradeInTotal,
} from "./TradeInSection.utils";

interface Props {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreditChange: (amount: number) => void;
}

const formatMoney = (n: number) =>
  "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TradeInSection: React.FC<Props> = ({ show, onOpen, onClose, onCreditChange }) => {
  const [rows, setRows] = useState<TradeInRow[]>(createDefaultTradeInRows);
  const [showAddKarat, setShowAddKarat] = useState(false);
  const [newKarat, setNewKarat] = useState("");
  const [newKaratPpg, setNewKaratPpg] = useState("0");

  const total = getTradeInTotal(rows);
  const activeRows = getActiveTradeInRows(rows);
  const activeWeight = activeRows.reduce((s, r) => s + r.weight, 0);

  useEffect(() => {
    onCreditChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const updateRow = (id: number, field: "weight" | "pricePerGram", value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: numValue } : r)));
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddKarat = () => {
    const karat = parseInt(newKarat) || 0;
    if (karat < 1 || karat > 24) return;
    if (rows.some((r) => r.karat === karat)) {
      setShowAddKarat(false);
      return;
    }
    const ppg = parseFloat(newKaratPpg) || 0;
    setRows((prev) =>
      [...prev, { id: Date.now(), karat, weight: 0, pricePerGram: ppg }].sort(
        (a, b) => Number(b.karat) - Number(a.karat),
      ),
    );
    setNewKarat("");
    setNewKaratPpg("0");
    setShowAddKarat(false);
  };

  const clearTradeIn = () => {
    setRows(createDefaultTradeInRows());
    onClose();
  };

  return (
    <>
      {activeRows.length > 0 && (
        <div className="ps-credit-panel ps-amber-border">
          <div className="ps-panel-label ps-credit-panel-label">
            <GiGoldBar /> Trade-in credit
          </div>
          <div className="ps-credit-val ps-amber-text">
            −{formatMoney(total)}
          </div>
          <div className="ps-credit-detail">
            {activeRows
              .map((r) => `${r.karat}K ${r.weight.toFixed(1)}g`)
              .join(" · ")}{" "}
            ({activeWeight.toFixed(2)}g)
          </div>
          <div className="ps-credit-actions">
            <button className="ps-btn ps-btn-amber" onClick={onOpen}>
              Edit
            </button>
            <button className="ps-btn ps-btn-outline" onClick={clearTradeIn}>
              Clear
            </button>
          </div>
        </div>
      )}

      {show && (
        <div
          className="ps-modal-overlay show"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="ps-modal ps-trade-modal">
            <div className="ps-modal-head">
              <span className="ps-modal-title">
                <GiGoldBar /> Trade-in gold
              </span>
              <button className="ps-modal-close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="ps-ti-cols">
              <span>Karat</span>
              <span>Weight (g)</span>
              <span>$/gram</span>
              <span>Credit</span>
              <span />
            </div>

            <div className="ps-ti-rows">
              {rows.map((r) => {
                const sub = r.weight * r.pricePerGram;
                return (
                  <div className="ps-ti-row" key={r.id}>
                    <div
                      className="ps-ti-karat"
                      style={{ background: getKaratColor(Number(r.karat)) }}
                    >
                      {r.karat}K
                    </div>
                    <input
                      type="number"
                      className="ps-ti-input"
                      value={r.weight || ""}
                      placeholder="0"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => updateRow(r.id, "weight", e.target.value)}
                    />
                    <input
                      type="number"
                      className="ps-ti-input"
                      value={r.pricePerGram || ""}
                      placeholder="0"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => updateRow(r.id, "pricePerGram", e.target.value)}
                    />
                    <div
                      className="ps-ti-sub"
                      style={{ color: sub > 0 ? "var(--pos-amber)" : "var(--pos-text-muted)" }}
                    >
                      {formatMoney(sub)}
                    </div>
                    <button className="ps-ti-remove" onClick={() => removeRow(r.id)}>
                      <FaTimes />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="ps-ti-add-row">
              <button className="ps-btn ps-btn-outline" onClick={() => setShowAddKarat(true)}>
                + Add karat row
              </button>
            </div>

            <div className="ps-ti-footer">
              <div>
                <div className="ps-ti-footer-label">Trade-in credit</div>
                <div className="ps-ti-footer-weight">
                  {rows.reduce((s, r) => s + r.weight, 0).toFixed(2)}g total
                </div>
              </div>
              <div className="ps-ti-footer-total">{formatMoney(total)}</div>
            </div>

            <div className="ps-ti-actions">
              <button className="ps-btn ps-btn-gold" onClick={onClose}>
                Apply credit
              </button>
              <button className="ps-btn ps-btn-outline" onClick={clearTradeIn}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddKarat && (
        <div
          className="ps-modal-overlay ps-modal-overlay-top show"
          onClick={(e) => e.target === e.currentTarget && setShowAddKarat(false)}
        >
          <div className="ps-modal">
            <div className="ps-modal-head">
              <span className="ps-modal-title">Add karat row</span>
              <button className="ps-modal-close" onClick={() => setShowAddKarat(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="ps-modal-body">
              <div className="ps-fg">
                <label>Karat *</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  placeholder="e.g. 9, 12, 19"
                  value={newKarat}
                  onChange={(e) => setNewKarat(e.target.value)}
                />
              </div>
              <div className="ps-fg">
                <label>Default $/gram</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={newKaratPpg}
                  onChange={(e) => setNewKaratPpg(e.target.value)}
                />
              </div>
              <div className="ps-modal-btns">
                <button className="ps-btn ps-btn-gold" onClick={handleAddKarat}>
                  Add
                </button>
                <button className="ps-btn ps-btn-outline" onClick={() => setShowAddKarat(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradeInSection;
