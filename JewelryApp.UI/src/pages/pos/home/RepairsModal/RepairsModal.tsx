import dateFormat from "dateformat";
import { FaTimes } from "react-icons/fa";
import CustomLoader from "../../../../components/CustomLoader/CustomLoader";
import { getDueStatus, type Repair } from "./RepairsModal.utils";
import "./repairsModal.scss";

interface RepairsModalProps {
  show: boolean;
  onClose: () => void;
  repairs: Repair[];
  isLoading?: boolean;
}

const RepairsModal = ({
  show,
  onClose,
  repairs,
  isLoading,
}: RepairsModalProps) => {
  return (
    <div
      className={`repair-modal-overlay ${show ? "show" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="repair-modal">
        <div className="repair-modal-head">
          <span className="repair-modal-title">In progress repairs</span>
          <button className="repair-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div>
          {isLoading ? (
            <CustomLoader />
          ) : repairs?.length ? (
            repairs.map((r) => {
              const status = getDueStatus(r.dueDate);
              const dueText =
                status === "overdue"
                  ? "Overdue"
                  : status === "today"
                    ? "Due today"
                    : r.dueDate
                      ? `Due ${dateFormat(r.dueDate, "mmm d")}`
                      : "No due date";
              return (
                <div className="repair-item" key={r.id}>
                  <div className="ri-slot">{r.slotNumber ?? "-"}</div>
                  <div className="ri-info">
                    <div className="ri-name">{r.customerName}</div>
                    <div className="ri-phone">{r.customerPhone}</div>
                    <div className="ri-notes">{r.notes}</div>
                  </div>
                  <div className="ri-right">
                    <div className="ri-cost">${r.cost.toFixed(2)}</div>
                    <div className={`ri-due ${status}`}>{dueText}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="repair-empty">No repairs in progress</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairsModal;
