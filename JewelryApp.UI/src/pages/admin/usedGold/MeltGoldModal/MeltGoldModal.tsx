import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FaFire, FaTimes } from "react-icons/fa";
import type { GoldPool } from "../UsedGold.type";
import {
  fmtCurrencyRounded,
  getAllKarats,
  getCurrentValue,
  getTotalOnHand,
} from "../UsedGold.utils";
import "./meltGoldModal.scss";

interface MeltGoldModalProps {
  show: boolean;
  onClose: () => void;
  pools: Record<number, GoldPool>;
  onConfirm: (bagWeight: number, notes: string) => void;
}

const MeltGoldModal: React.FC<MeltGoldModalProps> = ({
  show,
  onClose,
  pools,
  onConfirm,
}) => {
  const [bagWeight, setBagWeight] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setBagWeight("");
      setNotes("");
    }
  }, [show]);

  if (!show) return null;

  const totalWeight = getTotalOnHand(pools);
  const currentValue = getCurrentValue(pools);
  const numBagWeight = Number(bagWeight) || 0;
  const isValid = numBagWeight > 0 && numBagWeight <= totalWeight + 0.5;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(numBagWeight, notes.trim());
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
            Everything in the drawer goes to the dealer as a mixed bag. Enter
            the bag weight to confirm.
          </div>

          <div className="melt-pool-list">
            {getAllKarats(pools)
              .filter((k) => pools[k].weight > 0)
              .map((k) => (
                <div key={k} className="melt-pool-row">
                  <span className="melt-pool-k">{k}K</span>
                  <span className="melt-pool-w">
                    {pools[k].weight.toFixed(2)}g
                  </span>
                  <span className="melt-pool-c">
                    {fmtCurrencyRounded(pools[k].cost)}
                  </span>
                </div>
              ))}
          </div>

          <div className="melt-total-box">
            <span className="melt-total-label">Total in drawer</span>
            <span className="melt-total-value">
              {totalWeight.toFixed(2)}g — {fmtCurrencyRounded(currentValue)}
            </span>
          </div>

          <div className="fg2">
            <label>Bag weight (grams) *</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="Weigh the bag and enter here"
              value={bagWeight}
              onChange={(e) => {
                const raw = e.target.value;
                setBagWeight(raw === "" ? "" : Number(raw));
              }}
            />
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
            {numBagWeight > 0
              ? isValid
                ? `Confirm melt — ${numBagWeight.toFixed(2)}g`
                : `Weight exceeds ${totalWeight.toFixed(1)}g on hand`
              : "Enter bag weight"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeltGoldModal;
