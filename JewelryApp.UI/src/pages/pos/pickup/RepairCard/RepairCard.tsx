import { FaBell, FaCheck, FaCheckCircle, FaEdit, FaEye } from "react-icons/fa";
import type { Repair } from "../PickUp.type";
import {
  daysBetween,
  formatCurrency,
  formatPhone,
  getDueBadge,
} from "../PickUp.utils";
import "./repairCard.scss";

interface RepairCardProps {
  repair: Repair;
  onMarkReady: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (id: string) => void;
  onNotify: (id: string) => void;
  onPickedUp: (id: string) => void;
}

const RepairCard = ({
  repair,
  onMarkReady,
  onOpenDetail,
  onOpenEdit,
  onNotify,
  onPickedUp,
}: RepairCardProps) => {
  const due = getDueBadge(repair.dueDate);

  const waitedLabel = (() => {
    if (repair.status !== "done" || !repair.notified || !repair.notifiedDate)
      return null;
    const days = daysBetween(new Date(repair.notifiedDate), new Date());
    if (days <= 0) return "Called today";
    if (days === 1) return "Called yesterday";
    return `Called ${days} days ago`;
  })();

  return (
    <div className="repair-card">
      <div className="card-top">
        <span className="card-code">{repair.repairCode}</span>
        <span className="card-slot">Slot {repair.slotNumber}</span>
      </div>
      <div className="card-customer">{repair.customerName}</div>
      <div className="card-phone">{formatPhone(repair.customerPhone)}</div>
      <div className="card-notes">{repair.notes}</div>

      <div className="card-row">
        <span className="card-cost">{formatCurrency(repair.cost)}</span>
        <span className={`badge due-${due.className}`}>{due.label}</span>
      </div>

      <div className="card-row">
        <span className={`badge ${repair.paid ? "paid" : "unpaid"}`}>
          {repair.paid ? `Paid — ${repair.payMethod}` : "Unpaid"}
        </span>
        {repair.status === "done" && (
          <span className={`badge ${repair.notified ? "notified" : "notnotified"}`}>
            {repair.notified ? "Notified" : "Awaiting call"}
          </span>
        )}
      </div>

      {waitedLabel && <div className="card-waited">{waitedLabel}</div>}

      <div className="card-actions">
        {repair.status === "progress" && (
          <>
            <button className="act-primary" onClick={() => onMarkReady(repair.id)}>
              <FaCheck /> Mark ready
            </button>
            <button className="act-detail" onClick={() => onOpenDetail(repair.id)}>
              <FaEye /> Details
            </button>
            <button className="act-secondary" onClick={() => onOpenEdit(repair.id)}>
              <FaEdit /> Edit
            </button>
          </>
        )}
        {repair.status === "done" && repair.notified && (
          <>
            <button className="act-success" onClick={() => onPickedUp(repair.id)}>
              <FaCheckCircle /> Picked up
            </button>
            <button className="act-secondary" onClick={() => onNotify(repair.id)}>
              <FaBell /> Again
            </button>
          </>
        )}
        {repair.status === "done" && !repair.notified && (
          <>
            <button className="act-notify" onClick={() => onNotify(repair.id)}>
              <FaBell /> Notified
            </button>
            <button className="act-success" onClick={() => onPickedUp(repair.id)}>
              <FaCheckCircle /> Picked up
            </button>
          </>
        )}
      </div>

      {repair.status === "done" && (
        <div className="card-actions-2">
          <button className="act-detail" onClick={() => onOpenDetail(repair.id)}>
            <FaEye /> Details
          </button>
          <button className="act-secondary" onClick={() => onOpenEdit(repair.id)}>
            <FaEdit /> Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default RepairCard;
