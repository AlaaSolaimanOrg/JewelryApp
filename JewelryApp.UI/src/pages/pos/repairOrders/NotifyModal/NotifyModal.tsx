import { FaCheckCircle, FaHourglassHalf, FaSms, FaTimes } from "react-icons/fa";
import type { Repair } from "../RepairOrders.type";
import { formatPhone } from "../RepairOrders.utils";
import "./notifyModal.scss";

export type NotifyMode = "called" | "sms" | "later";

interface NotifyModalProps {
  repair: Repair | null;
  onClose: () => void;
  onConfirm: (mode: NotifyMode) => void;
}

const NotifyModal = ({ repair, onClose, onConfirm }: NotifyModalProps) => {
  if (!repair) return null;

  return (
    <div
      className="pu-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pu-modal pu-modal-sm">
        <div className="pu-modal-head">
          <span className="pu-modal-title">Repair done</span>
          <button className="pu-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="pu-modal-body">
          <div className="pu-notify-info">
            {repair.repairCode} — {repair.customerName} (
            {formatPhone(repair.customerPhone)})
          </div>
          <div className="pu-notify-question">Did you notify the customer?</div>
          <div className="pu-notify-options">
            <div
              className="pu-notify-opt pu-notify-opt-yes"
              onClick={() => onConfirm("called")}
            >
              <FaCheckCircle className="pu-notify-opt-icon" />
              <span className="pu-notify-opt-label">Yes, notified</span>
              <span className="pu-notify-opt-sub">Customer was called</span>
            </div>
            <div
              className="pu-notify-opt pu-notify-opt-sms"
              onClick={() => onConfirm("sms")}
            >
              <FaSms className="pu-notify-opt-icon" />
              <span className="pu-notify-opt-label">Text customer</span>
              <span className="pu-notify-opt-sub">Send SMS now</span>
            </div>
            <div
              className="pu-notify-opt pu-notify-opt-no"
              onClick={() => onConfirm("later")}
            >
              <FaHourglassHalf className="pu-notify-opt-icon" />
              <span className="pu-notify-opt-label">Not yet</span>
              <span className="pu-notify-opt-sub">Will call later</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyModal;
