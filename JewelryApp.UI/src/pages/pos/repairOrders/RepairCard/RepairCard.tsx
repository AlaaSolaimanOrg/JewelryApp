import { FaBell, FaCheck, FaCheckCircle, FaEdit, FaEye, FaReceipt, FaSms } from "react-icons/fa";
import type { Repair } from "../RepairOrders.type";
import {
  daysBetween,
  formatCurrency,
  formatPhone,
  getDueBadge,
} from "../RepairOrders.utils";
import "./repairCard.scss";

interface RepairCardProps {
  repair: Repair;
  onMarkReady: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (id: string) => void;
  onNotify: (id: string) => void;
  onSendSms: (id: string) => void;
  onPickedUp: (id: string) => void;
  onViewInvoice: (id: string) => void;
}

const RepairCard = ({
  repair,
  onMarkReady,
  onOpenDetail,
  onOpenEdit,
  onNotify,
  onSendSms,
  onPickedUp,
  onViewInvoice,
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
        <div className="card-top-right">
          <span className="card-slot">Slot {repair.slotNumber}</span>
          <button
            type="button"
            className="card-invoice-btn"
            title="View repair invoice"
            aria-label="View repair invoice"
            onClick={() => onViewInvoice(repair.id)}
          >
            <FaReceipt />
          </button>
        </div>
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
          {repair.paid
            ? repair.payMethod
              ? `Paid — ${repair.payMethod}`
              : "Paid"
            : "Unpaid"}
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
            <button className="act-sms" onClick={() => onSendSms(repair.id)}>
              <FaSms /> Text again
            </button>
          </>
        )}
        {repair.status === "done" && !repair.notified && (
          <>
            <button className="act-notify" onClick={() => onNotify(repair.id)}>
              <FaBell /> Notified
            </button>
            <button className="act-sms" onClick={() => onSendSms(repair.id)}>
              <FaSms /> Text
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
