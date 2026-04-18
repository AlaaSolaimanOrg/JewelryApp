import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaEdit,
  FaEllipsisV,
  FaFileInvoice,
  FaList,
  FaDollarSign,
} from "react-icons/fa";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import "./pickUp.scss";

import {
  PaymentStatus,
  RepairStatus,
  SortDirection,
} from "../../../types/enums";

import {
  getRepairs,
  updateRepairStatus,
  updateRepairPaymentStatus,
} from "../../../apis/repairs.api/repairs.api";
import CommentTooltip from "../../../components/CommentTooltip/CommentTooltip";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import EditRepairItemModal from "../../../components/modals/EditRepairItemModal/EditRepairItemModal";
import RepairInvoiceModal from "../../../components/modals/RepairInvoiceModal/RepairInvoiceModal";
import Paginator from "../../../components/Paginator/Paginator";
import { showError, showSuccess, splitCamelCaseWords } from "../../../utils";
import SmsConfirmPopup from "./SmsConfirmPopup/SmsConfirmPopup";

export interface Repair {
  id: string;
  repairCode: string;
  slotNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  status: RepairStatus;
  notes: string;
  cost: number;
  depositPaid: number;
  paymentStatus: PaymentStatus;
  dueDate: string | null;
}

const PickUp: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [repairIdToView, setRepairIdToView] = useState<string>("");
  const [smsPopup, setSmsPopup] = useState<{
    repairId: string;
    direction: "next" | "prev";
    currentStatus: RepairStatus;
  } | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const modalElement = document.querySelector(".modal");
      if (modalElement && modalElement.contains(target)) return;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    data: repairs,
    isLoading,
    fetchData: recallGetRepairs,
    onSearchChange,
    pagination,
    onPaginationChange,
  } = useLocalApiSearchSortPagination<Repair>({
    apiToCall: (data) => getRepairs(data.payload),
    extraPayload: { status: statusFilter },
    extraEffectDependency: [statusFilter],
    initialPageSize: 10,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleTogglePaymentStatus = async (
    repairId: string,
    currentPaymentStatus: PaymentStatus,
  ) => {
    const newPaymentStatus =
      currentPaymentStatus === PaymentStatus.Paid
        ? PaymentStatus.Unpaid
        : PaymentStatus.Paid;

    try {
      const response = await updateRepairPaymentStatus({
        id: repairId,
        newPaymentStatus,
      });

      if (response.statusCode === 200 || response.success) {
        showSuccess("Payment status updated");
        recallGetRepairs();
      } else {
        showError(response.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error(err);
      showError("Error updating payment status");
    }
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return "-";
    return new Date(dueDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const REPAIR_STATUS_UI: Record<
    RepairStatus,
    { label: string; className: string }
  > = {
    [RepairStatus.InProgress]: {
      label: "In Progress",
      className: "status-badge in-progress",
    },
    [RepairStatus.Completed]: {
      label: "Completed",
      className: "status-badge completed",
    },
    [RepairStatus.PickedUp]: {
      label: "Picked Up",
      className: "status-badge pickedup",
    },
  };

  const getNextStatus = (current: RepairStatus) => {
    switch (current) {
      case RepairStatus.InProgress:
        return RepairStatus.Completed;
      case RepairStatus.Completed:
        return RepairStatus.PickedUp;
      case RepairStatus.PickedUp:
        return RepairStatus.InProgress;
    }
  };

  const getPreviousStatus = (current: RepairStatus) => {
    switch (current) {
      case RepairStatus.PickedUp:
        return RepairStatus.Completed;
      case RepairStatus.Completed:
        return RepairStatus.InProgress;
      case RepairStatus.InProgress:
        return RepairStatus.PickedUp;
    }
  };

  const handleStatusUpdate = async (
    repairId: string,
    currentStatus: RepairStatus,
    direction: "next" | "prev",
    sendSms?: boolean,
  ) => {
    const newStatus =
      direction === "next"
        ? getNextStatus(currentStatus)
        : getPreviousStatus(currentStatus);

    try {
      const updatePayload: any = {
        id: repairId,
        status: newStatus,
        sendSms: sendSms,
      };

      if (newStatus === RepairStatus.PickedUp) {
        updatePayload.updateItemsPaymentStatus = true;
        updatePayload.newPaymentStatus = PaymentStatus.Paid;
      }

      const response = await updateRepairStatus(updatePayload);

      if (response.statusCode === 200 || response.success) {
        showSuccess("Status updated successfully");
        recallGetRepairs();
      } else {
        showError(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      showError("Error updating status");
    }
  };

  const handleStatusButtonClick = (
    repairId: string,
    currentStatus: RepairStatus,
    direction: "next" | "prev",
  ) => {
    const nextStatus =
      direction === "next"
        ? getNextStatus(currentStatus)
        : getPreviousStatus(currentStatus);

    if (nextStatus === RepairStatus.Completed) {
      setSmsPopup({ repairId, direction, currentStatus });
    } else {
      handleStatusUpdate(repairId, currentStatus, direction);
    }
  };

  const NEXT_STATUS_BUTTON_CLASS: Record<RepairStatus, string> = {
    [RepairStatus.InProgress]: "completed-btn",
    [RepairStatus.Completed]: "pickedup-btn",
    [RepairStatus.PickedUp]: "inprogress-btn",
  };

  return (
    <div id="pickUp-page" className="page-content pickUp-page">
      <section className="section repair-list-section">
        <div className="section-header">
          <h2 className="section-title">
            <FaList className="section-title__icon" />
            Repair Orders
          </h2>
          <span className="repair-count">{repairs?.length} repairs</span>
        </div>

        {/* FILTERS */}
        <div className="filter-section mt-4">
          <div className="search-container">
            <input
              type="text"
              className="search-input form-control"
              placeholder="Search repairs..."
              onChange={onSearchChange}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value={""}>All Statuses</option>
                <option value={RepairStatus.InProgress}>
                  {splitCamelCaseWords(RepairStatus[RepairStatus.InProgress])}
                </option>
                <option value={RepairStatus.Completed}>
                  {splitCamelCaseWords(RepairStatus[RepairStatus.Completed])}
                </option>
                <option value={RepairStatus.PickedUp}>
                  {splitCamelCaseWords(RepairStatus[RepairStatus.PickedUp])}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="repairs-container">
          {isLoading ? (
            <div className="repairs-loader">
              <CustomLoader />
            </div>
          ) : repairs?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Repairs Found</h3>
              <p>Try adjusting your filters or add a new repair</p>
            </div>
          ) : (
            <table className="repairs-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Slot</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Order Date</th>
                  <th>Notes</th>
                  <th>Payment</th>
                  <th>Due Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs?.map((repair) => {
                  const statusInfo = REPAIR_STATUS_UI[repair.status];

                  return (
                    <tr
                      key={repair.id}
                      className={`repair-row status-${repair.status}`}
                    >
                      <td className="repair-code">{repair.repairCode}</td>
                      <td>
                        {repair.status === RepairStatus.PickedUp ? (
                          <span className="slot-number-hidden">-</span>
                        ) : (
                          <span className="slot-number-tag">{repair.slotNumber}</span>
                        )}
                      </td>
                      <td>{repair.customerName}</td>
                      <td>{repair.customerPhone}</td>
                      <td>{formatDate(repair.orderDate)}</td>
                      <td>
                        {repair.notes ? (
                          <CommentTooltip comment={repair.notes} />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge-payment ${PaymentStatus[repair.paymentStatus]}`}
                        >
                          {PaymentStatus[repair.paymentStatus]}
                        </span>
                      </td>
                      <td>{formatDueDate(repair.dueDate)}</td>
                      <td>{formatCurrency(repair.cost)}</td>
                      <td>
                        <span className={statusInfo.className}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div
                          className="action-cell"
                          ref={
                            openDropdownId === repair.id ? dropdownRef : null
                          }
                        >
                          <button
                            className="action-menu-btn"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === repair.id ? null : repair.id,
                              )
                            }
                          >
                            <FaEllipsisV />
                          </button>

                          {openDropdownId === repair.id && (
                            <div className="action-dropdown">
                              <EditRepairItemModal
                                item={{ id: repair.id, cost: repair.cost }}
                                onRefresh={() => {
                                  recallGetRepairs();
                                  setOpenDropdownId(null);
                                }}
                              >
                                <button className="dropdown-item">
                                  <FaEdit />
                                  Edit
                                </button>
                              </EditRepairItemModal>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setRepairIdToView(repair.id);
                                  setShowInvoice(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FaFileInvoice />
                                Invoice
                              </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    handleTogglePaymentStatus(
                                      repair.id,
                                      repair.paymentStatus,
                                    );
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  <FaDollarSign />
                                  {repair.paymentStatus === PaymentStatus.Paid
                                    ? "Mark Unpaid"
                                    : "Mark Paid"}
                                </button>
                              <button
                                className={`dropdown-item status-dropdown-item ${NEXT_STATUS_BUTTON_CLASS[repair.status]}`}
                                onClick={() => {
                                  handleStatusButtonClick(
                                    repair.id,
                                    repair.status,
                                    "next",
                                  );
                                  setOpenDropdownId(null);
                                }}
                              >
                                <FaArrowRight />
                                {repair.status === RepairStatus.InProgress
                                  ? "Mark Complete"
                                  : repair.status === RepairStatus.Completed
                                    ? "Mark Picked Up"
                                    : "Mark In Progress"}
                              </button>
                              {/* Back action removed per UX update */}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {repairIdToView && (
          <RepairInvoiceModal
            repairId={repairIdToView}
            show={showInvoice}
            onClose={() => setShowInvoice(false)}
          />
        )}

        {smsPopup && (
          <SmsConfirmPopup
            onCancel={() => setSmsPopup(null)}
            onConfirm={(sendSms) => {
              handleStatusUpdate(
                smsPopup.repairId,
                smsPopup.currentStatus,
                smsPopup.direction,
                sendSms,
              );
              setSmsPopup(null);
            }}
          />
        )}

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
        />
      </section>
    </div>
  );
};

export default PickUp;
