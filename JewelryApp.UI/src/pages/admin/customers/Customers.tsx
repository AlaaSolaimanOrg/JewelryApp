import { useState } from "react";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import {
  deleteCustomer,
  getCustomers,
} from "../../../apis/customers.api/customers.api";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import AddCustomerModal from "../../../components/modals/AddCustomerModal/AddCustomerModal";
import ReceiptHistoryModal from "../../../components/modals/ReceiptHistoryModal/ReceiptHistoryModal";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable, {
  type TableHeader,
} from "../../../components/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  checkRequestSucceeded,
  handleSort,
  showError,
  showSuccess,
} from "../../../utils";
import "./customers.scss";

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}
const Customers = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  const [addCustomerModalView, setAddCustomerModalView] = useState<
    "add" | "edit" | "view"
  >("add");
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const {
    data: customers,
    fetchData: recallGetCustomers,
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

    { key: "actions", label: "Actions", width: "150px" },
  ];

  console.log("customers", customers);

  const handleDeleteCustomer = (customerId: string) => {
    setIsDeletingCustomer(true);

    const payload = { id: customerId };
    deleteCustomer(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          recallGetCustomers();
        } else {
          showError(response?.message || "Failed to delete customer");
        }
      })
      .catch((error) => {
        console.error(error);
        showError("An error occurred while deleting the customer");
      })
      .finally(() => {
        setIsDeletingCustomer(false);
      });
  };

  const data = customers?.map((customer) => {
    return {
      name: customer.name,
      phoneNumber: customer.phoneNumber,
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
          <ReceiptHistoryModal customerId={customer.id}>
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
          <button
            className="action-btn danger"
            title="Delete"
            onClick={() => {
              handleDeleteCustomer(customer.id);
            }}
          >
            <FaTrash />
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
        <CustomTable headers={headers} data={data} />

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

      <LoadingScreen isLoading={isDeletingCustomer} />
    </div>
  );
};

export default Customers;
