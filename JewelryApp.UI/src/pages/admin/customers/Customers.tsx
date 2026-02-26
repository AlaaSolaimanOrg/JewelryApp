import { useState } from "react";
import { FaEdit, FaEye, FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { getCustomers } from "../../../apis/customers.api/customers.api";
import AddCustomerModal from "../../../components/modals/AddCustomerModal/AddCustomerModal";
import ReceiptHistoryModal from "../../../components/modals/ReceiptHistoryModal/ReceiptHistoryModal";
import Paginator from "../../../components/Paginator/Paginator";

import CustomTable, {
  type TableHeader,
} from "../../../components/tables/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { handleSort } from "../../../utils";
import "./customers.scss";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalProductsPurchased: number;
  totalPurchasesValue: number;
  phoneNumber: string;
  birthday: string;
  total18K: number;
  total21K: number;
  totalDiscount: number;
}
const Customers = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [addCustomerModalView, setAddCustomerModalView] = useState<
    "add" | "edit" | "view"
  >("add");
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const {
    data: customers,
    fetchData: recallGetCustomers,
    isLoading,
    sortCriteria,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<Customer>({
    apiToCall: (data) => getCustomers(data.payload),
    initialPageSize: 5,
  });

  const headers: TableHeader[] = [
    {
      key: "name",
      label: "Name",
      width: "200px",
      onHeaderClick: () => {
        handleSort("name", sortCriteria, onSortChange);
      },
    },
    {
      key: "phoneNumber",
      label: "Phone",
      width: "150px",
      onHeaderClick: () => {
        handleSort("phoneNumber", sortCriteria, onSortChange);
      },
    },
    {
      key: "totalProductsPurchased",
      label: "Items Sold",
      width: "150px",
      onHeaderClick: () => {
        handleSort("totalProductsPurchased", sortCriteria, onSortChange);
      },
    },
    {
      key: "totalPurchasesValue",
      label: "Total Purchases Value",
      width: "150px",
      onHeaderClick: () => {
        handleSort("totalPurchasesValue", sortCriteria, onSortChange);
      },
    },

    { key: "actions", label: "Actions", width: "150px" },
  ];

  const data = customers?.map((customer) => {
    return {
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      totalProductsPurchased: customer.totalProductsPurchased,
      totalPurchasesValue: customer.totalPurchasesValue,
      actions: (
        <div className="action-buttons">
          <button
            className="action-btn"
            title="View"
            onClick={() => {
              setCustomerData(customer);
              setAddCustomerModalView("view");
              setShowAddCustomerModal(true);
            }}
          >
            <FaEye />
          </button>
          <ReceiptHistoryModal
            customerId={customer.id}
            totalWeight18K={customer.total18K}
            totalWeight21K={customer.total21K}
            totalAmount={customer.totalPurchasesValue}
            totalDiscount={customer.totalDiscount}
          >
            <button className="action-btn" title="View">
              <LuHistory />
            </button>
          </ReceiptHistoryModal>
          <button
            className="action-btn"
            title="Edit"
            onClick={() => {
              setCustomerData(customer);
              setAddCustomerModalView("edit");
              setShowAddCustomerModal(true);
            }}
          >
            <FaEdit />
          </button>
        </div>
      ),
    };
  });

  return (
    <div id="customers" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUsers className="icon" /> <span>Customer Management</span>
        </h1>
        <div className="page-actions">
          <button
            className="btn-md btn-gold"
            onClick={() => {
              setCustomerData(null);
              setAddCustomerModalView("add");
              setShowAddCustomerModal(true);
            }}
          >
            <FaPlus /> Add Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer List</h3>
          <div>
            <div className="search-bar" style={{ width: "250px" }}>
              <FaSearch className="icon me-1" />
              <input
                type="text"
                placeholder="Search customers..."
                onChange={onSearchChange}
              />
            </div>
          </div>
        </div>
        <CustomTable headers={headers} data={data} isLoading={isLoading} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        callGetCustomerDetails={recallGetCustomers}
        isCustomersView={true}
        mode={addCustomerModalView}
        customerData={customerData}
      />
    </div>
  );
};

export default Customers;
