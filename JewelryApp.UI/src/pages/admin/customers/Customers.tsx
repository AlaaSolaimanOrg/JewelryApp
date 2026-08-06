import { useState } from "react";
import { FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import { getCustomers } from "../../../apis/customers.api/customers.api";
import AddCustomerModal from "../../../components/modals/AddCustomerModal/AddCustomerModal";
import Paginator from "../../../components/Paginator/Paginator";

import CustomTable from "../../../components/tables/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { buildCustomerHeaders, buildCustomerTableData } from "./Customers.utils";
import "./customers.scss";

export interface Customer {
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
  lastPurchaseDate: string;
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
    onPageSizeChange,
    pagination,
  } = useLocalApiSearchSortPagination<Customer>({
    apiToCall: (data) => getCustomers(data.payload),
    initialPageSize: 25,
  });

  const openAdd = () => {
    setCustomerData(null);
    setAddCustomerModalView("add");
    setShowAddCustomerModal(true);
  };

  const openEdit = (customer: Customer) => {
    setCustomerData(customer);
    setAddCustomerModalView("edit");
    setShowAddCustomerModal(true);
  };

  const headers = buildCustomerHeaders(sortCriteria, onSortChange);
  const data = buildCustomerTableData(customers ?? [], { onEdit: openEdit });

  return (
    <div id="customers" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUsers className="icon" />
          <span>Customer management</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold" onClick={openAdd}>
            <FaPlus /> Add customer
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            Customers ({pagination.totalRecords ?? 0})
          </span>
          <div className="search-wrap">
            <FaSearch className="search-ico" />
            <input
              type="text"
              className="search-input"
              placeholder="Search name, phone, email..."
              onChange={onSearchChange}
            />
          </div>
        </div>

        <CustomTable headers={headers} data={data} isLoading={isLoading} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
          onPageSizeChange={onPageSizeChange}
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
