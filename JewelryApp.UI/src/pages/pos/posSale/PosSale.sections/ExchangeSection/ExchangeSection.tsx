import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import "./exchangeSection.scss";
import { ItemCondition, ReturnOption, ReturnReason } from "../../../../../types/enums";
import type {
  ExchangeApplyData,
  ExchangeSearchSale,
  SelectedExchangeItem,
} from "./ExchangeSection.type";
import {
  buildExchangeApplyData,
  formatMoney,
  getExchangeTotal,
  searchPastTransactions,
} from "./ExchangeSection.utils";

interface Props {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreditChange: (amount: number) => void;
  onExchangeChange: (data: ExchangeApplyData | null) => void;
}

const REASONS: { value: ReturnReason; label: string }[] = [
  { value: ReturnReason.NotAsExpected, label: "Not as expected" },
  { value: ReturnReason.WrongSize, label: "Wrong size" },
  { value: ReturnReason.Defective, label: "Defective" },
  { value: ReturnReason.GiftReturn, label: "Gift return" },
  { value: ReturnReason.Other, label: "Other" },
];

const CONDITIONS: { value: ItemCondition; label: string }[] = [
  { value: ItemCondition.Good, label: "Good" },
  { value: ItemCondition.NeedsPolishing, label: "Needs polish" },
  { value: ItemCondition.Damaged, label: "Damaged" },
];

const ExchangeSection: React.FC<Props> = ({
  show,
  onOpen,
  onClose,
  onCreditChange,
  onExchangeChange,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ExchangeSearchSale[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedSale, setSelectedSale] = useState<ExchangeSearchSale | null>(null);
  const [items, setItems] = useState<SelectedExchangeItem[]>([]);
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [reasonNote, setReasonNote] = useState("");

  const total = getExchangeTotal(items);

  const allHaveDestAndCondition =
    items.length > 0 && items.every((i) => i.dest && i.condition);
  const reasonNoteOk = reason !== ReturnReason.Other || !!reasonNote.trim();
  const canApply = items.length > 0 && !!reason && allHaveDestAndCondition && reasonNoteOk;

  useEffect(() => {
    onCreditChange(total);
    onExchangeChange(
      canApply && selectedSale
        ? buildExchangeApplyData(selectedSale, items, reason as ReturnReason, reasonNote)
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, canApply, items, reason, reasonNote, selectedSale]);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const sales = await searchPastTransactions(search);
        setResults(sales);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const selectTxn = (sale: ExchangeSearchSale) => {
    setSelectedSale(sale);
    setItems([]);
    setReason("");
    setReasonNote("");
  };

  const backToSearch = () => {
    setSelectedSale(null);
    setItems([]);
  };

  const toggleItem = (saleItemId: string) => {
    const exists = items.find((i) => i.saleItemId === saleItemId);
    if (exists) {
      setItems((prev) => prev.filter((i) => i.saleItemId !== saleItemId));
      return;
    }
    const item = selectedSale?.saleItems.find((i) => i.id === saleItemId);
    if (!item || item.quantity <= 0) return;
    setItems((prev) => [
      ...prev,
      {
        saleItemId,
        name: item.productName,
        karat: item.karat,
        sku: item.sku,
        unitPrice: item.quantity > 0 ? item.subtotalAfterDiscount / item.quantity : 0,
        purchasedQty: item.quantity,
        alreadyReturnedQty: item.quantityReturned,
        returnQty: 1,
        dest: "",
        condition: "",
      },
    ]);
  };

  const setItemQty = (saleItemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.saleItemId === saleItemId
          ? { ...i, returnQty: Math.max(1, Math.min(i.purchasedQty, i.returnQty + delta)) }
          : i,
      ),
    );
  };

  const setItemDest = (saleItemId: string, dest: ReturnOption) => {
    setItems((prev) => prev.map((i) => (i.saleItemId === saleItemId ? { ...i, dest } : i)));
  };

  const setItemCondition = (saleItemId: string, condition: ItemCondition) => {
    setItems((prev) => prev.map((i) => (i.saleItemId === saleItemId ? { ...i, condition } : i)));
  };

  const clearExchange = () => {
    setSelectedSale(null);
    setItems([]);
    setSearch("");
    setReason("");
    setReasonNote("");
    onClose();
  };

  const applyBtnLabel = () => {
    if (!items.length) return "Select items to return";
    const missing: string[] = [];
    if (!allHaveDestAndCondition) missing.push("condition & destination for each item");
    if (!reason) missing.push("reason");
    else if (!reasonNoteOk) missing.push("reason details");
    if (missing.length) return `Select ${missing.join(" & ")}`;
    return `Apply credit — ${formatMoney(total)}`;
  };

  return (
    <>
      {items.length > 0 && selectedSale && (
        <div className="ps-credit-panel ps-red-border">
          <div className="ps-panel-label">⏩ Exchange credit · {selectedSale.serialNumber}</div>
          <div className="ps-credit-val ps-red-text">−{formatMoney(total)}</div>
          <div className="ps-exch-items">
            {items.map((i) => (
              <div className="ps-exch-item" key={i.saleItemId}>
                <div>
                  <span className="ps-exch-item-name">
                    {i.dest === ReturnOption.MeltAfterReturn ? "🔥" : "📦"} {i.name}
                    {i.returnQty > 1 ? ` (×${i.returnQty})` : ""}
                  </span>{" "}
                  {i.sku && <span className="ps-exch-item-sku">{i.sku}</span>}
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
              {!selectedSale && (
                <div className="ps-exch-body">
                  {!search.trim() && (
                    <div className="ps-exch-placeholder">
                      Search for the original transaction
                    </div>
                  )}
                  {search.trim() && isSearching && (
                    <div className="ps-exch-placeholder">Searching...</div>
                  )}
                  {search.trim() && !isSearching && hasSearched && results.length === 0 && (
                    <div className="ps-exch-placeholder">No transactions found</div>
                  )}
                  {!isSearching &&
                    results.map((t) => (
                      <div
                        className="ps-exch-txn-card"
                        key={t.id}
                        onClick={() => selectTxn(t)}
                      >
                        <div className="ps-exch-txn-top">
                          <span className="ps-exch-txn-date">
                            {new Date(t.createdDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="ps-exch-txn-amt">{formatMoney(t.total)}</span>
                        </div>
                        <div className="ps-exch-txn-desc">
                          {t.customerName} · {t.customerPhone}
                        </div>
                        <div className="ps-exch-txn-id">{t.serialNumber}</div>
                      </div>
                    ))}
                </div>
              )}

              {selectedSale && (
                <div className="ps-exch-items-section">
                  <div className="ps-exch-back-row">
                    <button className="ps-exch-back" onClick={backToSearch}>
                      <FaArrowLeft /> Back to search
                    </button>
                  </div>
                  <div className="ps-exch-txn-info">
                    {new Date(selectedSale.createdDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {selectedSale.customerName} · {selectedSale.serialNumber}
                  </div>

                  <div className="ps-exch-items-view">
                    {selectedSale.saleItems.map((item) => {
                      const sel = items.find((i) => i.saleItemId === item.id);
                      const isReturnable = item.quantity > 0;
                      const qtyLabel = item.quantity > 1 ? ` (×${item.quantity} available)` : "";
                      const unitPrice =
                        item.quantity > 0 ? item.subtotalAfterDiscount / item.quantity : 0;
                      const lineTotal = sel ? unitPrice * sel.returnQty : item.subtotalAfterDiscount;
                      return (
                        <div
                          className={`ps-exch-item-card${sel ? " selected" : ""}${!isReturnable ? " disabled" : ""}`}
                          key={item.id}
                        >
                          <div
                            className="ps-exch-item-top"
                            onClick={() => isReturnable && toggleItem(item.id)}
                          >
                            <div className="ps-exch-cb">{sel && <FaCheck />}</div>
                            <div className="ps-exch-item-info">
                              <div className="ps-exch-item-nm">
                                {item.productName}
                                {qtyLabel}
                              </div>
                              <div className="ps-exch-item-meta">
                                {item.karat}K · {item.weight}g
                                {item.sku ? (
                                  <>
                                    {" "}
                                    · <span className="ps-mono">{item.sku}</span>
                                  </>
                                ) : null}
                                {item.quantityReturned > 0
                                  ? ` · ${item.quantityReturned} already returned`
                                  : ""}
                              </div>
                            </div>
                            {isReturnable ? (
                              <div className="ps-exch-item-price">{formatMoney(lineTotal)}</div>
                            ) : (
                              <span className="ps-exch-returned-badge">Fully returned</span>
                            )}
                          </div>

                          {sel && (
                            <div className="ps-exch-item-controls">
                              {item.quantity > 1 && (
                                <div className="ps-exch-ctrl-row">
                                  <span className="ps-exch-ctrl-label">Qty to return</span>
                                  <div className="ps-exch-qty">
                                    <button onClick={() => setItemQty(item.id, -1)}>−</button>
                                    <span>{sel.returnQty}</span>
                                    <button onClick={() => setItemQty(item.id, 1)}>+</button>
                                  </div>
                                  <span className="ps-exch-ctrl-ctx">of {item.quantity}</span>
                                </div>
                              )}
                              <div className="ps-exch-ctrl-row">
                                <span className="ps-exch-ctrl-label">Condition</span>
                                {CONDITIONS.map((c) => (
                                  <button
                                    key={c.value}
                                    className={`ps-exch-dest${sel.condition === c.value ? " sel" : ""}`}
                                    onClick={() => setItemCondition(item.id, c.value)}
                                  >
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                              <div className="ps-exch-ctrl-row">
                                <span className="ps-exch-ctrl-label">Destination</span>
                                <button
                                  className={`ps-exch-dest${sel.dest === ReturnOption.ReturnToStock ? " sel" : ""}`}
                                  onClick={() => setItemDest(item.id, ReturnOption.ReturnToStock)}
                                >
                                  📦 Return to stock
                                </button>
                                <button
                                  className={`ps-exch-dest${sel.dest === ReturnOption.MeltAfterReturn ? " sel" : ""}`}
                                  onClick={() => setItemDest(item.id, ReturnOption.MeltAfterReturn)}
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
                    <select
                      value={reason}
                      onChange={(e) =>
                        setReason(e.target.value ? (Number(e.target.value) as ReturnReason) : "")
                      }
                    >
                      <option value="">Select reason</option>
                      {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {reason === ReturnReason.Other && (
                      <textarea
                        className="ps-exch-reason-note"
                        placeholder="Please specify the reason..."
                        value={reasonNote}
                        onChange={(e) => setReasonNote(e.target.value)}
                      />
                    )}
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
