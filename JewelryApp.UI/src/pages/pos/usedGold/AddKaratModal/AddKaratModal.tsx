import { useEffect, useState } from "react";
import { showError } from "../../../../utils";
import "./addKaratModal.scss";

interface AddKaratModalProps {
  show: boolean;
  existingKarats: number[];
  onClose: () => void;
  onAdd: (karat: number, pricePerGram: number) => void;
}

const AddKaratModal = ({
  show,
  existingKarats,
  onClose,
  onAdd,
}: AddKaratModalProps) => {
  const [karat, setKarat] = useState("");
  const [pricePerGram, setPricePerGram] = useState("0");

  useEffect(() => {
    if (show) {
      setKarat("");
      setPricePerGram("0");
    }
  }, [show]);

  const handleAdd = () => {
    const karatValue = parseInt(karat, 10) || 0;
    const priceValue = parseFloat(pricePerGram) || 0;

    if (karatValue < 1 || karatValue > 24) {
      showError("Karat must be between 1 and 24");
      return;
    }
    if (existingKarats.includes(karatValue)) {
      showError(`${karatValue}K already exists`);
      return;
    }

    onAdd(karatValue, priceValue);
  };

  return (
    <div className={`ug-mo ${show ? "show" : ""}`}>
      <div className="ug-modal">
        <div className="ug-mh">
          <span className="ug-mh-title">Add karat row</span>
          <button className="ug-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ug-mb">
          <div className="ug-fg">
            <label>Karat *</label>
            <input
              type="number"
              min={1}
              max={24}
              placeholder="e.g. 9, 12, 19"
              value={karat}
              onChange={(e) => setKarat(e.target.value)}
            />
          </div>
          <div className="ug-fg">
            <label>Default price/gram ($)</label>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={pricePerGram}
              onChange={(e) => setPricePerGram(e.target.value)}
            />
          </div>
          <div className="ug-m-btns">
            <button className="ug-btn ug-btn-gold" onClick={handleAdd}>
              Add row
            </button>
            <button className="ug-btn ug-btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKaratModal;
