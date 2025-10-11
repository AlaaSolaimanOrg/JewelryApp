import { FaUsers } from "react-icons/fa";
import CommentTooltip from "../../../../components/CommentTooltip/CommentTooltip";
import Paginator from "../../../../components/Paginator/Paginator";
import ReceiptModal from "../../../../components/ReceiptModal/ReceiptModal";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { getSalesCustomers } from "../../../../apis/sales.api/sales.api";

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
  const {
    data: salesCustomers,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<SaleCustomers>({
    apiToCall: (data) => getSalesCustomers(data.payload),
    initialPageSize: 5,
  });

  return (
    <section className="section">
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
        <select className="filter-select">
          <option>All Customers</option>
          <option>New Customers</option>
          <option>Returning Customers</option>
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
            {salesCustomers.map((saleCustomer) => {
              return (
                <tr>
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
                      <button className="view-receipt-btn">View Receipt</button>
                    </ReceiptModal>
                  </td>
                </tr>
              );
            })}
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
