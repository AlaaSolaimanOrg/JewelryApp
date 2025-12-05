import React, { useState } from "react";
import { FaCalendarAlt, FaDollarSign, FaList, FaPhone } from "react-icons/fa";
import "./repairManagement.scss";

import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  PaymentStatus,
  ProductCategory,
  ProductType,
  RepairStatus,
  RepairType,
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

export interface RepairItem {
  id: string;
  itemType: ProductCategory;
  metal: ProductType;
  weight: number;
  stoneType: string;
  repairType: RepairType;
  notes: string;
  cost: number;
  urgentFee: number;
  discount: number;
  paymentStatus: PaymentStatus;
  depositPaid: number;
  dueDate: string | null;
  subTotal: number;
}

export interface Repair {
  id: string;
  repairCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  status: RepairStatus;
  totalCost: number;
  items: RepairItem[];
}

const RepairManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expandedRepairId, setExpandedRepairId] = useState<string | null>(null);

  const {
    data: repairs,
    isLoading,
    fetchData: recallGetRepairs,
    onSearchChange,
    pagination,
    onPaginationChange,
  } = useLocalApiSearchSortPagination<Repair>({
    apiToCall: (data) => getRepairs(data.payload),
    extraPayload: { repairType: typeFilter, status: statusFilter },
    extraEffectDependency: [typeFilter, statusFilter],
    initialPageSize: 5,
  });

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleRepairExpansion = (repairId: string) => {
    setExpandedRepairId(expandedRepairId === repairId ? null : repairId);
  };

  const REPAIR_STATUS_UI: Record<
    RepairStatus,
    { label: string; className: string; color: string }
  > = {
    [RepairStatus.InProgress]: {
      label: "In Progress",
      className: "status-badge in-progress",
      color: "#ff9800",
    },
    [RepairStatus.Completed]: {
      label: "Completed",
      className: "status-badge completed",
      color: "#4caf50",
    },
    [RepairStatus.PickedUp]: {
      label: "Picked Up",
      className: "status-badge pickedup",
      color: "#2196f3",
    },
  };

  const getRepairStatusInfo = (status: RepairStatus) => {
    return REPAIR_STATUS_UI[status];
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
    direction: "next" | "prev"
  ) => {
    const newStatus =
      direction === "next"
        ? getNextStatus(currentStatus)
        : getPreviousStatus(currentStatus);

    try {
      // When status changes to PickedUp, auto-update items to Paid
      const updatePayload: any = {
        id: repairId,
        status: newStatus,
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

  const NEXT_STATUS_BUTTON_CLASS: Record<RepairStatus, string> = {
    [RepairStatus.InProgress]: "completed-btn", // next is Completed (green)
    [RepairStatus.Completed]: "pickedup-btn", // next is PickedUp (blue)
    [RepairStatus.PickedUp]: "inprogress-btn", // next is InProgress (orange)
  };

  return (
    <div className="repair-management-page">
      <RepairStatsCards />

      <section className="section repair-list-section">
        <div className="section-header">
          <h2 className="section-title">
            <FaList className="section-title__icon" />
            Repair Orders
          </h2>
          <span className="repair-count">{repairs.length} repairs</span>
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

            <div className="filter-group">
              <label className="filter-label">Repair Type</label>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value={""}>All Types</option>
                <option value={RepairType.AddGold}>Add Gold</option>
                <option value={RepairType.Resize}>Resize</option>
                <option value={RepairType.Solder}>Solder</option>
                <option value={RepairType.StoneReplacement}>
                  Stone Replacement
                </option>
                <option value={RepairType.StoneTightening}>
                  Stone Tightening
                </option>
                <option value={RepairType.Polishing}>Polishing</option>
                <option value={RepairType.Cleaning}>Cleaning</option>
                <option value={RepairType.Plating}>Plating</option>
                <option value={RepairType.Engraving}>Engraving</option>
                <option value={RepairType.FixOrChangeLock}>
                  Fix Or Change Lock
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
          ) : repairs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Repairs Found</h3>
              <p>Try adjusting your filters or add a new repair</p>
            </div>
          ) : (
            repairs.map((repair) => {
              const statusInfo = getRepairStatusInfo(repair.status);
              const isExpanded = expandedRepairId === repair.id;

              return (
                <div
                  key={repair.id}
                  className={`repair-card ${isExpanded ? "expanded" : ""} ${
                    repair.status
                  }`}
                >
                  {/* CARD HEADER */}
                  <div
                    className="repair-card__header"
                    onClick={() => toggleRepairExpansion(repair.id)}
                  >
                    <div className="repair-card__customer">
                      <div className="customer-avatar">
                        {getCustomerInitials(repair.customerName)}
                      </div>
                      <div className="customer-info">
                        <h3 className="customer-name">{repair.customerName}</h3>
                        <div className="customer-meta">
                          <span className="meta-item">
                            <FaPhone className="meta-icon" />
                            {repair.customerPhone}
                          </span>
                          <span className="meta-item">
                            <FaCalendarAlt className="meta-icon" />
                            {formatDate(repair.orderDate)}
                          </span>
                          <span className="meta-item">
                            <FaDollarSign className="meta-icon" />
                            {formatCurrency(repair.totalCost)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="repair-card__actions">
                      <div className="repair-id">{repair.repairCode}</div>
                      <div className="repair-date">
                        <FaCalendarAlt className="meta-icon" />
                        {formatDate(repair.orderDate)}
                      </div>

                      <span className={statusInfo.className}>
                        {statusInfo.label}
                      </span>
                      <button className="expand-toggle">
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div className="repair-card__content">
                      <div className="repair-details">
                        <div className="detail-section">
                          <div className="section-header-row">
                            <h4 className="section-subtitle">
                              Repair Items ({repair.items.length})
                            </h4>
                          </div>

                          <div className="items-table-container">
                            <table className="items-table">
                              <thead>
                                <tr>
                                  <th>Id</th>
                                  <th>Item Type</th>
                                  <th>Metal</th>
                                  <th>Weight</th>
                                  <th>Stone</th>
                                  <th>Repair Type</th>
                                  <th>Payment</th>
                                  <th>Deposit Paid</th>
                                  <th>Notes</th>
                                  <th>Cost</th>
                                  <th>Urgent</th>
                                  <th>Discount</th>
                                  <th>Subtotal</th>
                                  <th>Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {repair.items.map((item, index) => (
                                  <tr key={item.id}>
                                    {/* I] */}
                                    <td>{index + 1}</td>
                                    {/* ITEM TYPE */}
                                    <td>
                                      <span className="badge-itemtype">
                                        {ProductCategory[item.itemType]}
                                      </span>
                                    </td>

                                    {/* METAL */}
                                    <td>
                                      <span className="badge-metal">
                                        {ProductType[item.metal]}
                                      </span>
                                    </td>

                                    {/* WEIGHT */}
                                    <td>{item.weight}g</td>

                                    {/* STONE TYPE (NO BADGE) */}
                                    <td>{item.stoneType || "None"}</td>

                                    {/* REPAIR TYPE */}
                                    <td>
                                      <span className="badge-repairtype">
                                        {splitCamelCaseWords(
                                          RepairType[item.repairType]
                                        )}
                                      </span>
                                    </td>

                                    {/* PAYMENT STATUS */}
                                    <td>
                                      <span
                                        className={`badge-payment ${
                                          PaymentStatus[item.paymentStatus]
                                        }`}
                                      >
                                        {PaymentStatus[item.paymentStatus]}
                                      </span>
                                    </td>

                                    {/* DEPOSIT PAID */}
                                    <td>
                                      {item.depositPaid > 0
                                        ? formatCurrency(item.depositPaid)
                                        : "-"}
                                    </td>

                                    {/* NOTES */}
                                    <td className="item-notes">
                                      {item.notes || "-"}
                                    </td>

                                    {/* COST */}
                                    <td>{formatCurrency(item.cost)}</td>

                                    {/* URGENT */}
                                    <td>
                                      {item.urgentFee > 0
                                        ? formatCurrency(item.urgentFee)
                                        : "-"}
                                    </td>

                                    {/* DISCOUNT */}
                                    <td>
                                      {item.discount > 0
                                        ? formatCurrency(item.discount)
                                        : "-"}
                                    </td>

                                    {/* SUBTOTAL */}
                                    <td>
                                      {formatCurrency(
                                        item.cost +
                                          item.urgentFee -
                                          item.discount
                                      )}
                                    </td>

                                    {/* EDIT BUTTON */}
                                    <td className="edit-cell">
                                      <EditRepairItemModal
                                        item={item}
                                        onRefresh={recallGetRepairs}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>

                              <tfoot>
                                <tr>
                                  <td colSpan={13} className="total-label">
                                    Total Cost:
                                  </td>
                                  <td className="total-cost">
                                    {formatCurrency(repair.totalCost)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="action-buttons">
                          <button className="btn btn-outline">
                            View Invoice
                          </button>
                          <button
                            className={`btn status-btn ${
                              NEXT_STATUS_BUTTON_CLASS[repair.status]
                            }`}
                            onClick={() =>
                              handleStatusUpdate(
                                repair.id,
                                repair.status,
                                "next"
                              )
                            }
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleStatusUpdate(
                                repair.id,
                                repair.status,
                                "prev"
                              );
                            }}
                          >
                            Mark As{" "}
                            {repair.status === RepairStatus.InProgress
                              ? "Completed"
                              : repair.status === RepairStatus.Completed
                              ? "Picked Up"
                              : "In Progress"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
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
