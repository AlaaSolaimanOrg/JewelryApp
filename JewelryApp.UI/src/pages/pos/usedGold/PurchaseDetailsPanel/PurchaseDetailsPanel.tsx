import { useMemo, useState } from "react";
import {
  FaMobileAlt,
  FaMoneyBillWave,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import type { GoldRow, PayMethod, Seller } from "../UsedGold.type";
import { formatCurrency, formatPhone, getInitials } from "../UsedGold.utils";
import "./purchaseDetailsPanel.scss";

interface PurchaseDetailsPanelProps {
  sellers: Seller[];
  seller: Seller | null;
  onSelectSeller: (seller: Seller | null) => void;
  onAddSellerClick: () => void;
  payMethod: PayMethod;
  onPayMethodChange: (method: PayMethod) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  rows: GoldRow[];
  saveLabel: string;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const PurchaseDetailsPanel = ({
  sellers,
  seller,
  onSelectSeller,
  onAddSellerClick,
  payMethod,
  onPayMethodChange,
  notes,
  onNotesChange,
  rows,
  saveLabel,
  canSave,
  onSave,
  onCancel,
}: PurchaseDetailsPanelProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return [];
    const phoneQuery = searchInput.replace(/\D/g, "");
    return sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        (phoneQuery && s.phone.includes(phoneQuery)),
    );
  }, [sellers, searchInput]);

  const handlePickSeller = (picked: Seller) => {
    onSelectSeller(picked);
    setSearchInput("");
    setIsSearchFocused(false);
  };

  const activeRows = rows.filter((r) => r.weight > 0 && r.pricePerGram > 0);
  const total = activeRows.reduce(
    (sum, r) => sum + r.weight * r.pricePerGram,
    0,
  );
  const totalWeight = activeRows.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="ug-right">
      <div className="ug-panel">
        <div className="ug-panel-label">Seller *</div>
        {seller ? (
          <div className="ug-seller-sel">
            <div className="ug-seller-av">{getInitials(seller.name)}</div>
            <div className="ug-seller-info">
              <div className="ug-seller-name">{seller.name}</div>
              <div className="ug-seller-phone">
                {formatPhone(seller.phone)}
              </div>
            </div>
            <button
              className="ug-seller-x"
              onClick={() => onSelectSeller(null)}
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <div className="ug-seller-search-wrap">
              <FaSearch className="ug-seller-search-ico" />
              <input
                type="text"
                className="ug-seller-search"
                placeholder="Search seller..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                autoComplete="off"
              />
              {isSearchFocused && !!searchResults.length && (
                <div className="ug-seller-drop">
                  {searchResults.map((s) => (
                    <div
                      key={s.phone}
                      className="ug-seller-opt"
                      onMouseDown={() => handlePickSeller(s)}
                    >
                      <span>{s.name}</span>
                      <span className="ug-seller-opt-phone">
                        {formatPhone(s.phone)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="ug-btn ug-btn-outline ug-seller-add-btn"
              onClick={onAddSellerClick}
            >
              <FaPlus /> New seller
            </button>
          </>
        )}
      </div>

      <div className="ug-panel">
        <div className="ug-panel-label">Payment method</div>
        <div className="ug-pay-tabs">
          <div
            className={`ug-pay-tab ${payMethod === "cash" ? "sel-cash" : ""}`}
            onClick={() => onPayMethodChange("cash")}
          >
            <FaMoneyBillWave className="ug-pt-ico" />
            <span className="ug-pt-lbl">Cash</span>
          </div>
          <div
            className={`ug-pay-tab ${
              payMethod === "eTransfer" ? "sel-eTransfer" : ""
            }`}
            onClick={() => onPayMethodChange("eTransfer")}
          >
            <FaMobileAlt className="ug-pt-ico" />
            <span className="ug-pt-lbl">E-Transfer</span>
          </div>
        </div>
      </div>

      <div className="ug-panel">
        <div className="ug-panel-label">Notes</div>
        <textarea
          className="ug-notes-ta"
          placeholder="e.g. 21K ring, 24K broken chain, tested with acid"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      <div className="ug-panel ug-summary">
        <div className="ug-sum-lines">
          {activeRows.map((r) => (
            <div className="ug-sum-row" key={r.id}>
              <span>
                {r.karat}K · {r.weight.toFixed(2)}g ×{" "}
                {formatCurrency(r.pricePerGram)}
              </span>
              <span>{formatCurrency(r.weight * r.pricePerGram)}</span>
            </div>
          ))}
        </div>
        <div className="ug-sum-total">
          <span>Pay to seller</span>
          <span className="ug-sum-total-price">{formatCurrency(total)}</span>
        </div>
        <div className="ug-sum-sub-label">
          {payMethod === "cash" ? "Cash" : "E-Transfer"} out from store box
        </div>
        <div className="ug-sum-weight">
          <span>Total weight</span>
          <span>{totalWeight.toFixed(2)}g</span>
        </div>
      </div>

      <button className="ug-save-btn" disabled={!canSave} onClick={onSave}>
        {saveLabel}
      </button>
      <div className="ug-cancel-link" onClick={onCancel}>
        Cancel
      </div>
    </div>
  );
};

export default PurchaseDetailsPanel;
