import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getSalesCustomers } from "../../../../apis/sales.api/sales.api";
import CommentTooltip from "../../../../components/CommentTooltip/CommentTooltip";
import Paginator from "../../../../components/Paginator/Paginator";

import ReceiptModal from "../../../../components/modals/ReceiptModal/ReceiptModal";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { CustomerFilter } from "../../../../types/enums";
import "./customersSoldTo.scss";
import type { TableHeader } from "../../../../components/Table/CustomTable";
import CustomTable from "../../../../components/Table/CustomTable";

interface SaleCustomers {
  customerId: string;
  saleId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  notesRemarks: string;
  createdDate: string;
}

const CustomersSoldTo = () => {
  const [customerFilter, setCustomerFilter] = useState<any>(null);

  const {
    data: salesCustomers,
    onSearchChange,
    onPaginationChange,
    pagination,
    isLoading, // Assuming your hook returns isLoading
  } = useLocalApiSearchSortPagination<SaleCustomers>({
    apiToCall: (data) => getSalesCustomers(data.payload),
    initialPageSize: 5,
    extraPayload: {
      customerFilter: customerFilter,
    },
    extraEffectDependency: [customerFilter],
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCustomerFilter(value ?? null);
  };

  // Define table headers
  const tableHeaders: TableHeader[] = [
    {
      key: "customerName",
      label: "Customer Name",
      width: "20%",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      width: "25%",
      sortable: true,
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      width: "15%",
      sortable: true,
    },
    {
      key: "notesRemarks",
      label: "Notes/Remarks",
      width: "20%",
      sortable: false,
    },
    {
      key: "action",
      label: "Action",
      width: "20%",
      sortable: false,
    },
  ];

  // Transform salesCustomers data for CustomTable
  const tableData = salesCustomers.map((saleCustomer) => ({
    customerName: saleCustomer.customerName,
    email: saleCustomer.email,
    phoneNumber: saleCustomer.phoneNumber,
    notesRemarks: saleCustomer.notesRemarks ? (
      <CommentTooltip comment={saleCustomer.notesRemarks} />
    ) : null,
    action: (
      <ReceiptModal saleId={saleCustomer.saleId}>
        <button className="view-receipt-btn">View Receipt</button>
      </ReceiptModal>
    ),
  }));

  return (
    <section id="customersSoldTo">
      <h2 className="section-title">
        <FaUsers className="icon" style={{ marginRight: "8px" }} /> Customers
        Sold To
      </h2>

      <div className="filter-section">
        <input
          type="text"
          className="filter-select"
          placeholder="Search by customer name..."
          onChange={onSearchChange}
        />
        <select
          className="filter-select"
          value={customerFilter || ""}
          onChange={handleFilterChange}
        >
          <option value="">All Customers</option>
          <option value={CustomerFilter.New}>New Customers</option>
          <option value={CustomerFilter.Returning}>Returning Customers</option>
        </select>
      </div>

      <div className="results-info">
        <p>
          Showing {salesCustomers.length} of {pagination.totalRecords} results
          {customerFilter && " (filtered)"}
        </p>
      </div>

      <CustomTable
        headers={tableHeaders}
        data={tableData}
        isLoading={isLoading}
      />

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
      />
    </section>
  );
};

export default CustomersSoldTo;
