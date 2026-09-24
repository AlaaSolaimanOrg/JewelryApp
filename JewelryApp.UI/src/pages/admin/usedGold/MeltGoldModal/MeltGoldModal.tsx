import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaFire, FaTimes } from "react-icons/fa";
import type { GoldPool } from "../UsedGold.type";
import {
  fmtCurrencyRounded,
  getAllKarats,
} from "../UsedGold.utils";
import "./meltGoldModal.scss";

interface MeltGoldModalProps {
  show: boolean;
  onClose: () => void;
  pools: Record<number, GoldPool>;
  onConfirm: (items: { karat: number; weight: number }[], notes: string) => void;
}

const MeltGoldModal: React.FC<MeltGoldModalProps> = ({
  show,
  onClose,
  pools,
  onConfirm,
}) => {
  const [weights, setWeights] = useState<Record<number, number | "">>({});
  const [notes, setNotes] = useState("");

  const karats = getAllKarats(pools).filter((k) => pools[k].weight > 0);

  useEffect(() => {
    if (show) {
      const initial: Record<number, number | ""> = {};
      karats.forEach((k) => {
        initial[k] = pools[k].weight;
      });
      setWeights(initial);
      setNotes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  const handleWeightChange = (karat: number, raw: string) => {
    const available = pools[karat]?.weight ?? 0;
    if (raw === "") {
      setWeights((prev) => ({ ...prev, [karat]: "" }));
      return;
    }
    setWeights((prev) => ({
      ...prev,
      [karat]: Math.max(0, Math.min(Number(raw), available)),
    }));
  };

  const handleSelectAll = () => {
    const all: Record<number, number | ""> = {};
    karats.forEach((k) => {
      all[k] = pools[k].weight;
    });
    setWeights(all);
  };

  const handleClearAll = () => {
    const none: Record<number, number | ""> = {};
    karats.forEach((k) => {
      none[k] = "";
    });
    setWeights(none);
  };

  const items = karats
    .map((k) => ({ karat: k, weight: Number(weights[k]) || 0 }))
    .filter((i) => i.weight > 0);

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const totalCost = items.reduce((sum, i) => {
    const pool = pools[i.karat];
    return sum + (pool.weight > 0 ? pool.cost * (i.weight / pool.weight) : 0);
  }, 0);
  const avgPurity =
    totalWeight > 0
      ? items.reduce((sum, i) => sum + i.karat * i.weight, 0) / totalWeight
      : 0;

  const isValid = items.length > 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(items, notes.trim());
  };

  return (
    <div className="melt-gold-modal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <FaFire /> Send to melt
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mo-body">
          <div className="mo-hint">
            Enter how many grams of each karat to send. Leave a karat at 0 to
            keep it in the drawer.
          </div>

          <div className="melt-pool-list-head">
            <button
              type="button"
              className="melt-link-btn"
              onClick={handleSelectAll}
            >
              Select all
            </button>
            <button
              type="button"
              className="melt-link-btn"
              onClick={handleClearAll}
            >
              Clear all
            </button>
          </div>

          <div className="melt-pool-list">
            {karats.map((k) => {
              const available = pools[k].weight;
              const rowWeight = weights[k] ?? "";
              const rowCost =
                available > 0 ? pools[k].cost * ((Number(rowWeight) || 0) / available) : 0;
              return (
                <div key={k} className="melt-pool-row">
                  <span className="melt-pool-k">{k}K</span>
                  <div className="melt-pool-input-wrap">
                    <Form.Control
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      min={0}
                      max={available}
                      step="any"
                      inputMode="decimal"
                      value={rowWeight}
                      onChange={(e) => handleWeightChange(k, e.target.value)}
                    />
                    <span className="melt-pool-avail">
                      / {available.toFixed(2)}g
                    </span>
                  </div>
                  <span className="melt-pool-c">
                    {fmtCurrencyRounded(rowCost)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="melt-total-box">
            <span className="melt-total-label">Sending to melt</span>
            <div className="melt-total-values">
              <span className="melt-total-value">
                {totalWeight.toFixed(2)}g — {fmtCurrencyRounded(totalCost)}
              </span>
              <span className="melt-total-purity">
                {avgPurity.toFixed(1)}K avg purity
              </span>
            </div>
          </div>

          <div className="fg2">
            <label>Dealer / Notes</label>
            <Form.Control
              as="textarea"
              placeholder="e.g. Sent to ABC Gold"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mo-foot">
          <button className="mo-btn mo-btn-dark" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mo-btn mo-btn-amber"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            <FaFire />{" "}
            {totalWeight > 0
              ? `Confirm melt — ${totalWeight.toFixed(2)}g`
              : "Enter weight to melt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeltGoldModal;
