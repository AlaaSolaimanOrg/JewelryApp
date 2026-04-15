import React, { useState } from "react";
import { FaList, FaTools } from "react-icons/fa";
import "./repairManagement.scss";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";

import {
  PaymentStatus,
  RepairStatus,
  SortDirection,
} from "../../../types/enums";

import {
  getRepairs,
  updateRepairStatus,
} from "../../../apis/repairs.api/repairs.api";
import Paginator from "../../../components/Paginator/Paginator";
import { showError, showSuccess, splitCamelCaseWords } from "../../../utils";
import RepairStatsCards from "./RepairStatsCards/RepairStatsCards";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import EditRepairItemModal from "../../../components/modals/EditRepairItemModal/EditRepairItemModal";
import RepairInvoiceModal from "../../../components/modals/RepairInvoiceModal/RepairInvoiceModal";
import CommentTooltip from "../../../components/CommentTooltip/CommentTooltip";
import SmsConfirmPopup from "./SmsConfirmPopup/SmsConfirmPopup";

export interface Repair {
  id: string;
  repairCode: string;
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

const RepairManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [repairIdToView, setRepairIdToView] = useState<string>("");
  const [smsPopup, setSmsPopup] = useState<{
    repairId: string;
    direction: "next" | "prev";
    currentStatus: RepairStatus;
  } | null>(null);

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
    <div className="repair-management-page">
      <div className="page-header">
        <h1 className="page-title">
          <FaTools className="icon" />
          <span>Repair Management</span>
        </h1>
      </div>

      <RepairStatsCards />

      <section className="section repair-list-section">
        <div className="section-header">
          <h2 className="section-title">
            <FaList className="section-title__icon" />
            Repair Orders
          </h2>
          <span className="repair-count">{repairs?.length} repairs</span>
        </div>

        {/* FILTERS */}
        <div className="filter-section">
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
                        <EditRepairItemModal
                          item={{ id: repair.id, cost: repair.cost }}
                          onRefresh={recallGetRepairs}
                        />
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setRepairIdToView(repair.id);
                            setShowInvoice(true);
                          }}
                        >
                          Invoice
                        </button>
                        <button
                          className={`btn status-btn btn-sm ${NEXT_STATUS_BUTTON_CLASS[repair.status]}`}
                          onClick={() =>
                            handleStatusButtonClick(
                              repair.id,
                              repair.status,
                              "next",
                            )
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleStatusButtonClick(
                              repair.id,
                              repair.status,
                              "prev",
                            );
                          }}
                        >
                          {repair.status === RepairStatus.InProgress
                            ? "Complete"
                            : repair.status === RepairStatus.Completed
                              ? "Picked Up"
                              : "In Progress"}
                        </button>
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

export default RepairManagement;
