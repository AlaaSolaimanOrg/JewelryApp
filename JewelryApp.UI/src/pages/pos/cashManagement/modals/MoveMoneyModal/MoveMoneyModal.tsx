import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaLongArrowAltRight } from "react-icons/fa";
import "./moveMoneyModal.scss";

export type MoveDirection = "t2s" | "s2t";

interface MoveMoneyModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (direction: MoveDirection, amount: number, reason: string) => void;
}

const MoveMoneyModal = ({ show, onClose, onSubmit }: MoveMoneyModalProps) => {
  const [direction, setDirection] = useState<MoveDirection>("t2s");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (show) {
      setDirection("t2s");
      setAmount("");
      setReason("");
    }
  }, [show]);

  return (
    <div className={`cash-mo ${show ? "show" : ""}`}>
      <div className="cash-modal">
        <div className="cash-mh">
          <span className="cash-mh-title">Move money between boxes</span>
          <button className="cash-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cash-mb">
          <div className="cash-fg">
            <label>Direction</label>
          </div>
          <Row className="g-2 cash-move-dir">
            <Col xs={6}>
              <button
                className={`cash-move-opt ${direction === "t2s" ? "sel" : ""}`}
                onClick={() => setDirection("t2s")}
              >
                <span className="cash-move-opt-ico">
                  <FaLongArrowAltRight />
                </span>
                <span className="cash-move-opt-lbl">Transfers → Store</span>
              </button>
            </Col>
            <Col xs={6}>
              <button
                className={`cash-move-opt ${direction === "s2t" ? "sel" : ""}`}
                onClick={() => setDirection("s2t")}
              >
                <span className="cash-move-opt-ico">
                  <FaLongArrowAltRight />
                </span>
                <span className="cash-move-opt-lbl">Store → Transfers</span>
              </button>
            </Col>
          </Row>
          <div className="cash-fg">
            <label>Amount ($) *</label>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="cash-fg">
            <label>Reason</label>
            <input
              type="text"
              placeholder="Optional note"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="cash-m-btns">
            <button
              className="cash-btn cash-btn-gold"
              onClick={() =>
                onSubmit(direction, parseFloat(amount) || 0, reason.trim())
              }
            >
              Move money
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

export default MoveMoneyModal;
