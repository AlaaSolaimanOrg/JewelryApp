import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import "./repairManagement.scss";

import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  PaymentStatus,
  ProductCategory,
  ProductType,
  RepairStatus,
  RepairType,
} from "../../../types/enums";

import { getRepairs } from "../../../apis/repairs.api/repairs.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTableWithAccordion, {
  type Column,
} from "../../../components/tables/CustomTableWithAccordion/CustomTableWithAccordion";
import { splitCamelCaseWords } from "../../../utils";
import RepairStatsCards from "./RepairStatsCards/RepairStatsCards";

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
  dueDate: string | null;
  subTotal: number;
}

export interface Repair {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  status: RepairStatus;
  totalCost: number;
  notes: string;
  items: RepairItem[];
  paymentStatus: PaymentStatus;
}

const RepairManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState("");

  const {
    data: repairs,
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

  // TABLE COLUMNS — identical to old visuals
  const columns: Column<Repair>[] = [
    { label: "Repair ID", accessor: "id" },
    { label: "Customer", accessor: "customerName" },
    {
      label: "Items",
      render: (row) => `${row.items.length} item(s)`,
    },
    {
      label: "Status",
      render: (row) => {
        const { label, className } = getRepairStatusInfo(row.status);
        return <span className={className}>{label}</span>;
      },
    },
    {
      label: "Total",
      render: (row) => formatCurrency(row.totalCost),
    },
    {
      label: "Actions",
      render: (row) => {
        return <button className="status-action-btn">{row.status}</button>;
      },
    },
  ];

  const REPAIR_STATUS_UI: Record<
    RepairStatus,
    { label: string; className: string; actionText?: string }
  > = {
    [RepairStatus.Received]: {
      label: "Received",
      className: "status-badge received",
    },
    [RepairStatus.InProgress]: {
      label: "In Progress",
      className: "status-badge pending",
    },
    [RepairStatus.Ready]: {
      label: "Ready",
      className: "status-badge ready",
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

  const getRepairStatusInfo = (status: RepairStatus) => {
    return REPAIR_STATUS_UI[status];
  };

  return (
    <div className="repair-management-page">
      <RepairStatsCards />

      <section className="section repair-list-section">
        <h2 className="section-title">
          <FaList className="section-title__icon" />
          Repair List
        </h2>

        {/* FILTERS */}
        <div className="filter-section">
          <input
            type="text"
            className="search-input form-control"
            placeholder="Search by name, phone, or repair ID..."
            onChange={onSearchChange}
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value={""}>All Statuses</option>
            <option value={RepairStatus.Received}>
              {splitCamelCaseWords(RepairStatus[RepairStatus.Received])}
            </option>
            <option value={RepairStatus.InProgress}>
              {splitCamelCaseWords(RepairStatus[RepairStatus.InProgress])}
            </option>
            <option value={RepairStatus.Ready}>
              {splitCamelCaseWords(RepairStatus[RepairStatus.Ready])}
            </option>
            <option value={RepairStatus.Completed}>
              {splitCamelCaseWords(RepairStatus[RepairStatus.Completed])}
            </option>
            <option value={RepairStatus.PickedUp}>
              {splitCamelCaseWords(RepairStatus[RepairStatus.PickedUp])}
            </option>
          </select>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value={""}>All Repair Types</option>
            <option value={RepairType.AddGold}>Add Gold</option>
            <option value={RepairType.Resize}>Resize</option>
            <option value={RepairType.Solder}>Solder</option>
            <option value={RepairType.StoneReplacement}>
              Stone Replacement
            </option>
            <option value={RepairType.StoneTightening}>Stone Tightening</option>
            <option value={RepairType.Polishing}>Polishing</option>
            <option value={RepairType.Cleaning}>Cleaning</option>
            <option value={RepairType.Plating}>Plating</option>
            <option value={RepairType.Engraving}>Engraving</option>
            <option value={RepairType.FixOrChangeLock}>
              Fix Or Change Lock
            </option>
          </select>
        </div>

        {/* TABLE */}
        <CustomTableWithAccordion
          data={repairs}
          columns={columns}
          rowKey="id"
          emptyMessage="No repairs found."
          renderAccordion={(repair) => (
            <div className="sub-table-wrapper">
              <table className="sub-table">
                <thead>
                  <tr>
                    <th>Item Type</th>
                    <th>Metal</th>
                    <th>Weight</th>
                    <th>Stone</th>
                    <th>Repair Type</th>
                    <th>Cost</th>
                    <th>Urgent Fee</th>
                    <th>Discount</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {repair.items.map((item) => (
                    <tr key={item.id}>
                      <td>{ProductCategory[item.itemType]}</td>
                      <td>{item.metal}</td>
                      <td>{item.weight}</td>
                      <td>{item.stoneType}</td>
                      <td>
                        {splitCamelCaseWords(RepairType[item.repairType])}
                      </td>
                      <td>{formatCurrency(item.cost)}</td>
                      <td>{formatCurrency(item.urgentFee)}</td>
                      <td>{formatCurrency(item.discount)}</td>
                      <td>{formatCurrency(item.subTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        />

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
