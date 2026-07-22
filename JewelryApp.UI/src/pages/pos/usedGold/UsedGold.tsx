import { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { Link } from "react-router-dom";
import { showSuccess } from "../../../utils";
import AddKaratModal from "./AddKaratModal/AddKaratModal";
import AddSellerModal from "./AddSellerModal/AddSellerModal";
import GoldItemsPanel from "./GoldItemsPanel/GoldItemsPanel";
import PurchaseDetailsPanel from "./PurchaseDetailsPanel/PurchaseDetailsPanel";
import type { GoldRow, PayMethod, Seller } from "./UsedGold.type";
import {
  DEFAULT_KARATS,
  DEFAULT_KARAT_PRICES,
  INITIAL_SELLERS,
  formatCurrency,
} from "./UsedGold.utils";
import "./usedGold.scss";

const UsedGold = () => {
  const nextId = useRef(1);

  const createDefaultRows = (): GoldRow[] =>
    DEFAULT_KARATS.map((karat) => ({
      id: nextId.current++,
      karat,
      weight: 0,
      pricePerGram: DEFAULT_KARAT_PRICES[karat] ?? 0,
    }));

  const [rows, setRows] = useState<GoldRow[]>(createDefaultRows);
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [notes, setNotes] = useState("");
  const [showAddKarat, setShowAddKarat] = useState(false);
  const [showAddSeller, setShowAddSeller] = useState(false);

  const handleWeightChange = (id: number, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, weight: Math.max(0, parseFloat(value) || 0) } : r,
      ),
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, pricePerGram: Math.max(0, parseFloat(value) || 0) }
          : r,
      ),
    );
  };

  const handleRemoveRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddKaratRow = (karat: number, pricePerGram: number) => {
    setRows((prev) =>
      [...prev, { id: nextId.current++, karat, weight: 0, pricePerGram }].sort(
        (a, b) => b.karat - a.karat,
      ),
    );
    setShowAddKarat(false);
  };

  const handleAddSeller = (newSeller: Seller) => {
    setSellers((prev) => [...prev, newSeller]);
    setSeller(newSeller);
    setShowAddSeller(false);
  };

  const activeRows = rows.filter((r) => r.weight > 0 && r.pricePerGram > 0);
  const total = activeRows.reduce(
    (sum, r) => sum + r.weight * r.pricePerGram,
    0,
  );
  const totalWeight = activeRows.reduce((sum, r) => sum + r.weight, 0);

  const resetForm = () => {
    setRows(createDefaultRows());
    setSeller(null);
    setPayMethod("cash");
    setNotes("");
  };

  const handleSave = () => {
    if (!seller) return;
    showSuccess(
      `Purchased ${totalWeight.toFixed(2)}g from ${seller.name} — ${formatCurrency(
        total,
      )} (${payMethod === "cash" ? "Cash" : "E-Transfer"})`,
    );
    resetForm();
  };

  let saveLabel = "Add gold items to start";
  let canSave = false;
  if (activeRows.length) {
    if (!seller) {
      saveLabel = "Select a seller";
    } else if (total <= 0) {
      saveLabel = "Total must be > $0";
    } else {
      saveLabel = `Pay ${formatCurrency(total)} — ${
        payMethod === "cash" ? "cash out" : "e-transfer"
      }`;
      canSave = true;
    }
  }

  return (
    <div className="used-gold-page">
      <div className="ug-top-bar">
        <span className="ug-top-title">
          <GiGoldBar /> Used gold purchase
        </span>
        <Link to="/" className="ug-btn ug-btn-outline">
          <FaArrowLeft /> Back to POS
        </Link>
      </div>

      <div className="ug-main">
        <div className="ug-left">
          <GoldItemsPanel
            rows={rows}
            onWeightChange={handleWeightChange}
            onPriceChange={handlePriceChange}
            onRemove={handleRemoveRow}
            onAddClick={() => setShowAddKarat(true)}
          />
        </div>

        <PurchaseDetailsPanel
          sellers={sellers}
          seller={seller}
          onSelectSeller={setSeller}
          onAddSellerClick={() => setShowAddSeller(true)}
          payMethod={payMethod}
          onPayMethodChange={setPayMethod}
          notes={notes}
          onNotesChange={setNotes}
          rows={rows}
          saveLabel={saveLabel}
          canSave={canSave}
          onSave={handleSave}
          onCancel={resetForm}
        />
      </div>

      <AddKaratModal
        show={showAddKarat}
        existingKarats={rows.map((r) => r.karat)}
        onClose={() => setShowAddKarat(false)}
        onAdd={handleAddKaratRow}
      />
      <AddSellerModal
        show={showAddSeller}
        onClose={() => setShowAddSeller(false)}
        onAdd={handleAddSeller}
      />
    </div>
  );
};

export default UsedGold;
