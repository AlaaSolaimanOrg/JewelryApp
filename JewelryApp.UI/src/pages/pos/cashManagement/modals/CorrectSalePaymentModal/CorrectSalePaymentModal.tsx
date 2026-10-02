import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaCreditCard, FaMoneyBillWave, FaRandom } from "react-icons/fa";
import { formatCurrency } from "../../CashManagement.utils";
import type { CorrectionPayMethod, SaleLookup } from "./CorrectSalePaymentModal.type";
import {
  detectPayMethod,
  fetchSale,
  roundMoney,
} from "./CorrectSalePaymentModal.utils";
import "./correctSalePaymentModal.scss";

interface CorrectSalePaymentModalProps {
  show: boolean;
  saleId?: string;
  onClose: () => void;
  onSubmit: (
    saleId: string,
    cashAmount: number,
    cardAmount: number,
    reason: string,
  ) => void;
}

const PAY_METHODS: {
  key: CorrectionPayMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "cash", label: "Cash", icon: <FaMoneyBillWave /> },
  { key: "card", label: "Card", icon: <FaCreditCard /> },
  { key: "split", label: "Split", icon: <FaRandom /> },
];

const CorrectSalePaymentModal = ({
  show,
  saleId,
  onClose,
  onSubmit,
}: CorrectSalePaymentModalProps) => {
  const [sale, setSale] = useState<SaleLookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [method, setMethod] = useState<CorrectionPayMethod>("cash");
  const [cash, setCash] = useState("");
  const [reason, setReason] = useState("");

  const loadSale = async (id: string) => {
    setLoading(true);
    const found = await fetchSale(id);
    setLoading(false);
    if (!found) {
      setNotFound(true);
      return;
    }
    setSale(found);
    setMethod(detectPayMethod(found));
    setCash(String(roundMoney(found.cashAmount ?? 0)));
  };

  useEffect(() => {
    if (!show) return;
    setSale(null);
    setNotFound(false);
    setMethod("cash");
    setCash("");
    setReason("");
    if (saleId) loadSale(saleId);
  }, [show, saleId]);

  const total = sale?.total ?? 0;
  const oldCash = sale?.cashAmount ?? 0;
  const oldCard = sale?.cardAmount ?? 0;
  const newCash = roundMoney(Math.min(Math.max(parseFloat(cash) || 0, 0), total));
  const newCard = roundMoney(total - newCash);
  const cashDiff = roundMoney(newCash - oldCash);
  const hasChange = Math.abs(cashDiff) >= 0.01;
  const canSubmit = !!sale && hasChange && !!reason.trim();

  const selectMethod = (m: CorrectionPayMethod) => {
    setMethod(m);
    if (m === "cash") setCash(String(roundMoney(total)));
    if (m === "card") setCash("0");
  };

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal correct-sale-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Correct sale payment</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          {loading && <div className="correct-sale-status">Loading sale...</div>}
          {notFound && <div className="correct-sale-error">Sale not found</div>}

          {sale && (
            <>
              <div className="cash-original-entry">
                <div className="cash-original-label">RECORDED PAYMENT</div>
                <div className="cash-original-desc">
                  Sale #{sale.serialNumber} — {sale.customerName}
                </div>
                <div className="cash-original-amt">
                  Total {formatCurrency(total)} · Cash {formatCurrency(oldCash)} ·
                  Card {formatCurrency(oldCard)}
                </div>
              </div>

              <div className="cash-fg">
                <label>Correct payment method</label>
              </div>
              <Row className="g-2 correct-sale-methods">
                {PAY_METHODS.map((m) => (
                  <Col xs={4} key={m.key}>
                    <button
                      className={`correct-sale-opt ${method === m.key ? `sel-${m.key}` : ""}`}
                      onClick={() => selectMethod(m.key)}
                    >
                      <span className="correct-sale-opt-ico">{m.icon}</span>
                      <span className="correct-sale-opt-lbl">{m.label}</span>
                    </button>
                  </Col>
                ))}
              </Row>

              <Row className="g-2">
                <Col xs={6}>
                  <div className="cash-fg">
                    <label>Cash ($)</label>
                    <input
                      type="number"
                      min={0}
                      max={total}
                      step="any"
                      inputMode="decimal"
                      value={cash}
                      disabled={method !== "split"}
                      onChange={(e) => setCash(e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="cash-fg">
                    <label>Card ($)</label>
                    <input type="text" value={newCard.toFixed(2)} disabled />
                  </div>
                </Col>
              </Row>

              {hasChange && (
                <div
                  className={`correct-sale-diff ${cashDiff > 0 ? "in" : "out"}`}
                >
                  Will {cashDiff > 0 ? "add" : "remove"}{" "}
                  {formatCurrency(cashDiff)} {cashDiff > 0 ? "to" : "from"} the
                  store box
                </div>
              )}

              <div className="cash-fg">
                <label>Reason for correction *</label>
                <textarea
                  placeholder="e.g. Customer paid by card, cash was selected by mistake"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              disabled={!canSubmit}
              onClick={() =>
                sale && onSubmit(sale.id, newCash, newCard, reason.trim())
              }
            >
              Submit correction
            </button>
            <button className="cash-btn cash-btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectSalePaymentModal;
