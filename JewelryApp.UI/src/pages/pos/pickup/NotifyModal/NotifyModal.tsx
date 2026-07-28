import { FaCheckCircle, FaHourglassHalf, FaTimes } from "react-icons/fa";
import type { Repair } from "../PickUp.type";
import { formatPhone } from "../PickUp.utils";
import "./notifyModal.scss";

interface NotifyModalProps {
  repair: Repair | null;
  onClose: () => void;
  onConfirm: (didNotify: boolean) => void;
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
              onClick={() => onConfirm(true)}
            >
              <FaCheckCircle className="pu-notify-opt-icon" />
              <span className="pu-notify-opt-label">Yes, notified</span>
              <span className="pu-notify-opt-sub">Customer was called</span>
            </div>
            <div
              className="pu-notify-opt pu-notify-opt-no"
              onClick={() => onConfirm(false)}
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
