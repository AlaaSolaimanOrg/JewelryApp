import type { Repair } from "../PickUp.type";
import { formatCurrency, formatDate, formatPhone } from "../PickUp.utils";
import "./completedCard.scss";

interface CompletedCardProps {
  repair: Repair;
}

const CompletedCard = ({ repair }: CompletedCardProps) => {
  const isCancelled = repair.status === "cancelled";

  return (
    <div className="completed-card">
      <div className="card-top">
        <span className="card-code">{repair.repairCode}</span>
        <span className={`badge ${isCancelled ? "cancelled" : "pickedup"}`}>
          {isCancelled ? "Cancelled" : "Picked up"}
        </span>
      </div>
      <div className="card-customer">{repair.customerName}</div>
      <div className="completed-info">
        <span className="completed-detail">{formatPhone(repair.customerPhone)}</span>
        <span className="completed-detail">
          Ordered <span>{formatDate(repair.orderDate)}</span>
        </span>
        <span className="completed-detail">
          Cost <span>{formatCurrency(repair.cost)}</span>
        </span>
        {repair.pickedUpDate && (
          <span className="completed-detail">
            Picked up <span>{formatDate(repair.pickedUpDate)}</span>
          </span>
        )}
        {repair.cancelledDate && (
          <span className="completed-detail">
            Cancelled <span>{formatDate(repair.cancelledDate)}</span>
          </span>
        )}
        {repair.payMethod && (
          <span className="completed-detail">
            Paid <span>{repair.payMethod}</span>
          </span>
        )}
      </div>
      <div className="card-notes">{repair.notes}</div>
    </div>
  );
};

export default CompletedCard;
