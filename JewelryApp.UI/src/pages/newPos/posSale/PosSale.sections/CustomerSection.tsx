import React, {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUserCircle,
} from "react-icons/fa";
import AddCustomerModal from "../../../../components/AddCustomerModal/AddCustomerModal";
import type { Customer } from "../types";
import { getCustomer } from "../../../../apis/customers.api/customers.api";
import useLocalApi from "../../../../hooks/useLocalApi";
import { debounce } from "../../../../utils";
import dateFormat from "date-format";

interface Props {
  customer: Customer;
  setCustomer: Dispatch<SetStateAction<Customer>>;
  customerInfoActive: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  onAddCustomerClick: () => void;
  showAddCustomerModal: boolean;
  setShowAddCustomerModal: (v: boolean) => void;
  onOpenScanModal: () => void;
  setCustomerInfoActive: (v: boolean) => void;
  setCustomerSelectedId:Dispatch<SetStateAction<string>>;
}

const CustomerSection: React.FC<Props> = ({
  customer,
  setCustomer,
  customerInfoActive,
  searchInput,
  setSearchInput,
  onAddCustomerClick,
  showAddCustomerModal,
  setShowAddCustomerModal,
  onOpenScanModal,
  setCustomerInfoActive,
  setCustomerSelectedId
}) => {
  const [customerSearchValue, setCustomerSearchValue] = useState("");
  const { data: customerDetails, fetchData: callGetCustomerDetails } =
    useLocalApi({
      apiToCall: (data) => getCustomer(data.payload),
      payload: {
        searchBy: searchInput,
      },
      dataInitalValue: null,
      effectDependency: [searchInput],
    }) as {
      data: Customer;
      fetchData: () => void;
    };

  console.log("searchInput", searchInput);

  useEffect(() => {
    console.log("customerDetails", customerDetails);
    setCustomer(customerDetails);
    setCustomerInfoActive(!!customerDetails);
    setCustomerSelectedId(customerDetails?.id ?? null)
  }, [customerDetails]);

  console.log("customerInfoActive", customerInfoActive);

  // Create the debounced function once
  const debouncedSetSearchInput = useCallback(
    debounce((value) => setSearchInput(value), 500),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setCustomerSearchValue(value);
    debouncedSetSearchInput(value);
  };
  return (
    <>
      <header className="header">
        <div className="logo">GoldCraft POS</div>
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder={`Search customer by ...`}
            maxLength={40}
            value={customerSearchValue}
            onChange={handleChange}
          />
          <button className="add-customer-btn" onClick={onAddCustomerClick}>
            Add New Customer
          </button>
        </div>
        <button className="scan-btn" onClick={onOpenScanModal}>
          {/* kept icon placement to avoid changing styles */}
          Scan Product
        </button>
      </header>

      {!!customer && (
        <div
          className={`customer-info${customerInfoActive ? " active" : ""}`}
          id="customerInfo"
        >
          <h3 className="customer-title">
            <FaUser /> Customer Information
          </h3>
          <div className="customer-details">
            <div className="customer-detail">
              <FaUserCircle
                style={{ marginRight: "8px", color: "var(--primary-blue)" }}
              />
              <span id="customerName">{customer.name}</span>
            </div>
            <div className="customer-detail">
              <FaEnvelope
                style={{ marginRight: "8px", color: "var(--primary-blue)" }}
              />
              <span id="customerEmail">{customer.email ?? "-"}</span>
            </div>
            <div className="customer-detail">
              <FaPhone
                style={{ marginRight: "8px", color: "var(--primary-blue)" }}
              />
              <span id="customerPhone">{customer.phoneNumber ?? "-"}</span>
            </div>
            <div className="customer-detail">
              <FaBirthdayCake
                style={{ marginRight: "8px", color: "var(--primary-blue)" }}
              />
              <span id="customerBirthday">{customer.birthday ?? "-"}</span>
            </div>
          </div>
        </div>
      )}

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        callGetCustomerDetails={callGetCustomerDetails}
        setSearchInput={setSearchInput}
        setCustomerSearchValue={setCustomerSearchValue}
      />
    </>
  );
};

export default CustomerSection;
