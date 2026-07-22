import { useEffect, useState } from "react";
import { showError } from "../../../../utils";
import type { Seller } from "../UsedGold.type";
import "./addSellerModal.scss";

interface AddSellerModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (seller: Seller) => void;
}

const AddSellerModal = ({ show, onClose, onAdd }: AddSellerModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (show) {
      setName("");
      setPhone("");
    }
  }, [show]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const digits = phone.replace(/\D/g, "");

    if (!trimmedName || !digits) {
      showError("Name and phone are required");
      return;
    }

    onAdd({ name: trimmedName, phone: digits });
  };

  return (
    <div className={`ug-mo ${show ? "show" : ""}`}>
      <div className="ug-modal">
        <div className="ug-mh">
          <span className="ug-mh-title">Add new seller</span>
          <button className="ug-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ug-mb">
          <div className="ug-fg">
            <label>Name *</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="ug-fg">
            <label>Phone *</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="ug-m-btns">
            <button className="ug-btn ug-btn-gold" onClick={handleSave}>
              Save
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

export default AddSellerModal;
