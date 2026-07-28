import { FaTimes } from "react-icons/fa";
import type { Repair } from "../PickUp.type";
import {
  daysBetween,
  formatCurrency,
  formatDate,
  formatPhone,
  getStatusColor,
  getStatusLabel,
} from "../PickUp.utils";
import "./detailModal.scss";

interface DetailModalProps {
  repair: Repair | null;
  onClose: () => void;
}

const DetailModal = ({ repair, onClose }: DetailModalProps) => {
  if (!repair) return null;

  const daysInShop = daysBetween(new Date(repair.orderDate), new Date());
  const notifiedDaysAgo = repair.notifiedDate
    ? daysBetween(new Date(repair.notifiedDate), new Date())
    : 0;

  return (
    <div
      className="pu-modal-overlay show"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pu-modal">
        <div className="pu-modal-head">
          <span className="pu-modal-title">{repair.repairCode} — Details</span>
          <button className="pu-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="pu-modal-body">
          <div className="pu-detail-grid">
            <div>
              <div className="pu-detail-label">Customer</div>
              <div className="pu-detail-value">{repair.customerName}</div>
            </div>
            <div>
              <div className="pu-detail-label">Phone</div>
              <div className="pu-detail-value">{formatPhone(repair.customerPhone)}</div>
            </div>
            <div>
              <div className="pu-detail-label">Repair code</div>
              <div className="pu-detail-value">{repair.repairCode}</div>
            </div>
            <div>
              <div className="pu-detail-label">Slot</div>
              <div className="pu-detail-value">
                {repair.slotNumber != null ? `Slot ${repair.slotNumber}` : "—"}
              </div>
            </div>
            <div>
              <div className="pu-detail-label">Cost</div>
              <div className="pu-detail-value">{formatCurrency(repair.cost)}</div>
            </div>
            <div>
              <div className="pu-detail-label">Payment</div>
              <div
                className="pu-detail-value"
                style={{ color: repair.paid ? "var(--pos-green)" : "var(--pos-red)" }}
              >
                {repair.paid ? `Paid — ${repair.payMethod}` : "Unpaid"}
              </div>
            </div>
            <div>
              <div className="pu-detail-label">Due date</div>
              <div className="pu-detail-value">{formatDate(repair.dueDate)}</div>
            </div>
            <div>
              <div className="pu-detail-label">Status</div>
              <div
                className="pu-detail-value"
                style={{ color: getStatusColor(repair.status) }}
              >
                {getStatusLabel(repair.status, repair.notified)}
              </div>
            </div>
            <div>
              <div className="pu-detail-label">Dropped off</div>
              <div className="pu-detail-value">{formatDate(repair.orderDate)}</div>
            </div>
            <div>
              <div className="pu-detail-label">Days in shop</div>
              <div className="pu-detail-value">
                {daysInShop} day{daysInShop !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="pu-detail-notes">
            <div className="pu-detail-label">Repair notes</div>
            <div className="pu-detail-notes-box">{repair.notes}</div>
          </div>

          <div className="pu-detail-label pu-timeline-label">Timeline</div>
          <div className="pu-timeline">
            <div className="pu-timeline-item">
              <div
                className="pu-timeline-dot"
                style={{ background: "var(--pos-text-muted)" }}
              />
              <div className="pu-timeline-line" />
              <div>
                <div className="pu-timeline-text">Repair dropped off</div>
                <div className="pu-timeline-date">
                  {formatDate(repair.orderDate)} — {daysInShop} day
                  {daysInShop !== 1 ? "s" : ""} ago
                </div>
              </div>
            </div>

            {(repair.status === "done" || repair.status === "completed") && (
              <div className="pu-timeline-item">
                <div
                  className="pu-timeline-dot"
                  style={{ background: "var(--pos-green)" }}
                />
                <div className="pu-timeline-line" />
                <div>
                  <div className="pu-timeline-text">Repair completed</div>
                  <div className="pu-timeline-date">Marked done</div>
                </div>
              </div>
            )}

            {repair.notifiedDate ? (
              <div className="pu-timeline-item">
                <div
                  className="pu-timeline-dot"
                  style={{ background: "var(--pos-purple)" }}
                />
                <div className="pu-timeline-line" />
                <div>
                  <div className="pu-timeline-text">Customer notified</div>
                  <div className="pu-timeline-date">
                    {formatDate(repair.notifiedDate)}
                    {notifiedDaysAgo > 0
                      ? ` — ${notifiedDaysAgo} day${notifiedDaysAgo !== 1 ? "s" : ""} ago`
                      : ""}
                  </div>
                </div>
              </div>
            ) : (
              repair.status === "done" && (
                <div className="pu-timeline-item">
                  <div
                    className="pu-timeline-dot"
                    style={{ background: "var(--pos-amber)", opacity: 0.6 }}
                  />
                  <div className="pu-timeline-line" />
                  <div>
                    <div
                      className="pu-timeline-text"
                      style={{ color: "var(--pos-amber)" }}
                    >
                      Customer not yet notified
                    </div>
                    <div className="pu-timeline-date">Call when possible</div>
                  </div>
                </div>
              )
            )}

            {repair.pickedUpDate && (
              <div className="pu-timeline-item">
                <div
                  className="pu-timeline-dot"
                  style={{ background: "var(--pos-green)" }}
                />
                <div className="pu-timeline-line" />
                <div>
                  <div className="pu-timeline-text">Picked up by customer</div>
                  <div className="pu-timeline-date">{formatDate(repair.pickedUpDate)}</div>
                </div>
              </div>
            )}

            {repair.cancelledDate && (
              <div className="pu-timeline-item">
                <div
                  className="pu-timeline-dot"
                  style={{ background: "var(--pos-red)" }}
                />
                <div className="pu-timeline-line" />
                <div>
                  <div className="pu-timeline-text">Repair cancelled</div>
                  <div className="pu-timeline-date">{formatDate(repair.cancelledDate)}</div>
                </div>
              </div>
            )}

            {repair.status === "progress" && (
              <div className="pu-timeline-item">
                <div
                  className="pu-timeline-dot"
                  style={{ background: "var(--pos-amber)", opacity: 0.4 }}
                />
                <div>
                  <div
                    className="pu-timeline-text"
                    style={{ color: "var(--pos-text-subtle)" }}
                  >
                    Waiting to be completed...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
