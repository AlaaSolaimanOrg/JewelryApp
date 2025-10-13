import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getSalesCustomers } from "../../../../apis/sales.api/sales.api";
import CommentTooltip from "../../../../components/CommentTooltip/CommentTooltip";
import Paginator from "../../../../components/Paginator/Paginator";
import ReceiptModal from "../../../../components/ReceiptModal/ReceiptModal";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { CustomerFilter } from "../../../../types/enums";
import "./customersSoldTo.scss";

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
  const [customerFilter, setCustomerFilter] = useState<CustomerFilter | null>(
    null
  );

  const {
    data: salesCustomers,
    onSearchChange,
    onPaginationChange,
    pagination,
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

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Notes/Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagination.totalRecords ? (
              salesCustomers.map((saleCustomer) => {
                console.log("salesCustomers", salesCustomers);
                return (
                  <tr key={saleCustomer.saleId}>
                    <td>{saleCustomer.customerName}</td>
                    <td>{saleCustomer.email}</td>
                    <td>{saleCustomer.phoneNumber}</td>
                    <td>
                      {saleCustomer.notesRemarks && (
                        <CommentTooltip comment={saleCustomer.notesRemarks} />
                      )}
                    </td>
                    <td>
                      <ReceiptModal saleId={saleCustomer.saleId}>
                        <button className="view-receipt-btn">
                          View Receipt
                        </button>
                      </ReceiptModal>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="noResultsFound">
                <td colSpan={5}>No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
