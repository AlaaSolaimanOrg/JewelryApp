import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import "./exchangeSection.scss";
import type { PastTransaction, SelectedExchangeItem } from "./ExchangeSection.type";
import {
  getExchangeTotal,
  getTransactionTotal,
  searchPastTransactions,
} from "./ExchangeSection.utils";

interface Props {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreditChange: (amount: number) => void;
}

const REASONS = [
  "Changed mind",
  "Wrong item",
  "Defective",
  "Size issue",
  "Gift return",
  "Other",
];

const formatMoney = (n: number) =>
  "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ExchangeSection: React.FC<Props> = ({ show, onOpen, onClose, onCreditChange }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PastTransaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<PastTransaction | null>(null);
  const [items, setItems] = useState<SelectedExchangeItem[]>([]);
  const [reason, setReason] = useState("");

  const total = getExchangeTotal(items);

  useEffect(() => {
    onCreditChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    setResults(search.trim() ? searchPastTransactions(search) : []);
  }, [search]);

  const selectTxn = (txn: PastTransaction) => {
    setSelectedTxn(txn);
    setItems([]);
    setReason("");
  };

  const backToSearch = () => {
    setSelectedTxn(null);
    setItems([]);
  };

  const toggleItem = (idx: number) => {
    const exists = items.find((i) => i.idx === idx);
    if (exists) {
      setItems((prev) => prev.filter((i) => i.idx !== idx));
      return;
    }
    const item = selectedTxn?.items[idx];
    if (!item) return;
    setItems((prev) => [
      ...prev,
      {
        idx,
        name: item.name,
        karat: item.karat,
        sku: item.sku,
        unitPrice: item.unitPrice,
        purchasedQty: item.qty,
        returnQty: 1,
        dest: "",
      },
    ]);
  };

  const setItemQty = (idx: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.idx === idx
          ? { ...i, returnQty: Math.max(1, Math.min(i.purchasedQty, i.returnQty + delta)) }
          : i,
      ),
    );
  };

  const setItemDest = (idx: number, dest: "stock" | "melt") => {
    setItems((prev) => prev.map((i) => (i.idx === idx ? { ...i, dest } : i)));
  };

  const clearExchange = () => {
    setSelectedTxn(null);
    setItems([]);
    setSearch("");
    setReason("");
    onClose();
  };

  const allHaveDest = items.length > 0 && items.every((i) => i.dest);
  const canApply = items.length > 0 && !!reason && allHaveDest;

  const applyBtnLabel = () => {
    if (!items.length) return "Select items to return";
    const missing: string[] = [];
    if (!reason) missing.push("reason");
    if (!allHaveDest) missing.push("destination for each item");
    if (missing.length) return `Select ${missing.join(" & ")}`;
    return `Apply credit — ${formatMoney(total)}`;
  };

  return (
    <>
      {items.length > 0 && selectedTxn && (
        <div className="ps-credit-panel ps-red-border">
          <div className="ps-panel-label">⏩ Exchange credit · {selectedTxn.id}</div>
          <div className="ps-credit-val ps-red-text">−{formatMoney(total)}</div>
          <div className="ps-exch-items">
            {items.map((i) => (
              <div className="ps-exch-item" key={i.idx}>
                <div>
                  <span className="ps-exch-item-name">
                    {i.dest === "melt" ? "🔥" : "📦"} {i.name}
                    {i.returnQty > 1 ? ` (×${i.returnQty})` : ""}
                  </span>{" "}
                  <span className="ps-exch-item-sku">{i.sku}</span>
                </div>
                <span className="ps-exch-item-amt">−{formatMoney(i.unitPrice * i.returnQty)}</span>
              </div>
            ))}
          </div>
          <div className="ps-credit-actions">
            <button className="ps-btn ps-btn-red" onClick={onOpen}>
              Edit
            </button>
            <button className="ps-btn ps-btn-outline" onClick={clearExchange}>
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
          <div className="ps-modal ps-exch-modal">
            <div className="ps-modal-head">
              <span className="ps-modal-title">⏩ Exchange — select transaction</span>
              <button className="ps-modal-close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="ps-exch-search">
              <input
                type="text"
                placeholder="Search by name, phone, or receipt #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="ps-exch-scroll">
              {!selectedTxn && (
                <div className="ps-exch-body">
                  {!search.trim() && (
                    <div className="ps-exch-placeholder">
                      Search for the original transaction
                    </div>
                  )}
                  {search.trim() && results.length === 0 && (
                    <div className="ps-exch-placeholder">No transactions found</div>
                  )}
                  {results.map((t) => (
                    <div
                      className="ps-exch-txn-card"
                      key={t.id}
                      onClick={() => selectTxn(t)}
                    >
                      <div className="ps-exch-txn-top">
                        <span className="ps-exch-txn-date">{t.date}</span>
                        <span className="ps-exch-txn-amt">
                          {formatMoney(getTransactionTotal(t))}
                        </span>
                      </div>
                      <div className="ps-exch-txn-desc">{t.desc}</div>
                      <div className="ps-exch-txn-id">
                        {t.id} · {t.customer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTxn && (
                <div className="ps-exch-items-section">
                  <div className="ps-exch-back-row">
                    <button className="ps-exch-back" onClick={backToSearch}>
                      <FaArrowLeft /> Back to search
                    </button>
                  </div>
                  <div className="ps-exch-txn-info">
                    {selectedTxn.date} · {selectedTxn.customer} · {selectedTxn.id}
                  </div>

                  <div className="ps-exch-items-view">
                    {selectedTxn.items.map((item, idx) => {
                      const sel = items.find((i) => i.idx === idx);
                      const qtyLabel = item.qty > 1 ? ` (×${item.qty} purchased)` : "";
                      const lineTotal = sel ? item.unitPrice * sel.returnQty : item.unitPrice * item.qty;
                      return (
                        <div
                          className={`ps-exch-item-card${sel ? " selected" : ""}`}
                          key={idx}
                        >
                          <div className="ps-exch-item-top" onClick={() => toggleItem(idx)}>
                            <div className="ps-exch-cb">{sel && <FaCheck />}</div>
                            <div className="ps-exch-item-info">
                              <div className="ps-exch-item-nm">
                                {item.name}
                                {qtyLabel}
                              </div>
                              <div className="ps-exch-item-meta">
                                {item.karat}K · {item.weight} ·{" "}
                                <span className="ps-mono">{item.sku}</span>
                              </div>
                            </div>
                            <div className="ps-exch-item-price">{formatMoney(lineTotal)}</div>
                          </div>

                          {sel && (
                            <div className="ps-exch-item-controls">
                              {item.qty > 1 && (
                                <div className="ps-exch-ctrl-row">
                                  <span className="ps-exch-ctrl-label">Qty to return</span>
                                  <div className="ps-exch-qty">
                                    <button onClick={() => setItemQty(idx, -1)}>−</button>
                                    <span>{sel.returnQty}</span>
                                    <button onClick={() => setItemQty(idx, 1)}>+</button>
                                  </div>
                                  <span className="ps-exch-ctrl-ctx">of {item.qty}</span>
                                </div>
                              )}
                              <div className="ps-exch-ctrl-row">
                                <span className="ps-exch-ctrl-label">Destination</span>
                                <button
                                  className={`ps-exch-dest${sel.dest === "stock" ? " sel" : ""}`}
                                  onClick={() => setItemDest(idx, "stock")}
                                >
                                  📦 Return to stock
                                </button>
                                <button
                                  className={`ps-exch-dest${sel.dest === "melt" ? " sel" : ""}`}
                                  onClick={() => setItemDest(idx, "melt")}
                                >
                                  🔥 Melt
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="ps-exch-reason">
                    <label>Return reason</label>
                    <select value={reason} onChange={(e) => setReason(e.target.value)}>
                      <option value="">Select reason</option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="ps-exch-footer-area">
              <div className="ps-exch-total-bar">
                <span>Exchange credit</span>
                <span className="ps-exch-total-val">{formatMoney(total)}</span>
              </div>
              <div className="ps-exch-footer">
                <button
                  className="ps-btn ps-btn-gold"
                  disabled={!canApply}
                  onClick={onClose}
                >
                  {applyBtnLabel()}
                </button>
                <button className="ps-btn ps-btn-outline" onClick={onClose}>
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

export default ExchangeSection;
