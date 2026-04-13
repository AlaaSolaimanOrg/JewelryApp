import React, {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  FaBirthdayCake,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import AsyncSelect from "react-select/async";
import { getCustomers } from "../../../../../apis/customers.api/customers.api";
import AddCustomerModal from "../../../../../components/modals/AddCustomerModal/AddCustomerModal";
import type { Customer } from "../../types";
import "./customerSection.scss";

interface Props {
  customer: Customer | null;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
  customerInfoActive: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  onAddCustomerClick: () => void;
  showAddCustomerModal: boolean;
  setShowAddCustomerModal: (v: boolean) => void;
  onOpenScanModal: () => void;
  setCustomerInfoActive: (v: boolean) => void;
  actions?: any;
  showScanProduct?: boolean;
  showNotes?: boolean;
  onToggleNotes?: () => void;
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
  actions = null,
  showScanProduct = false,
  showNotes = false,
  onToggleNotes = () => {},
}) => {
  // Refs for debounce
  const debouncedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resolversRef = useRef<Map<string, (value: any[]) => void>>(new Map());

  // Actual API call
  const performSearch = useCallback(
    async (inputValue: string): Promise<any[]> => {
      if (!inputValue) return [];

      try {
        const response = await getCustomers({
          searchBy: inputValue,
          pageSize: 5,
          pageNumber: 1,
        });

        return (
          response.data?.map((customer: Customer) => ({
            label: customer.name,
            value: customer.id,
            data: customer,
          })) || []
        );
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    [],
  );

  // Debounced loadOptions
  const loadOptions = useCallback(
    (inputValue: string): Promise<any[]> => {
      return new Promise((resolve) => {
        if (debouncedTimeoutRef.current)
          clearTimeout(debouncedTimeoutRef.current);

        resolversRef.current.set(inputValue, resolve);

        debouncedTimeoutRef.current = setTimeout(async () => {
          const results = await performSearch(inputValue);
          const resolver = resolversRef.current.get(inputValue);
          if (resolver) {
            resolver(results);
            resolversRef.current.delete(inputValue);
          }
        }, 500); // 500ms debounce
      });
    },
    [performSearch],
  );

  return (
    <div id="customerSection">
      <header className="header">
        <div className="logo">Adi Jewelry POS</div>
        <div className="search-section">
          <AsyncSelect
            className="customerSearch"
            cacheOptions
            loadOptions={loadOptions} // <-- Debounced search
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            defaultOptions
            placeholder="Search customer by name..."
            noOptionsMessage={({ inputValue }) =>
              inputValue ? "No customers found" : "Type to search customers"
            }
            loadingMessage={() => "Searching..."}
            inputValue={searchInput}
            onInputChange={(value) => setSearchInput(value)}
            onChange={(selected) => {
              if (selected) {
                setCustomerInfoActive(true);
                setCustomer(selected.data);
              } else {
                setCustomerInfoActive(false);
                setCustomer(null);
                setSearchInput("");
              }
            }}
            value={
              customer
                ? { label: customer.name, value: customer.id, data: customer }
                : null
            }
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                width: "100%",
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:hover": { border: "none", boxShadow: "none" },
              }),
              placeholder: (base) => ({ ...base, color: "lightgray" }),
              singleValue: (base) => ({ ...base, color: "white" }),
              input: (base) => ({ ...base, color: "white", width: "100%" }),
              container: (base) => ({ ...base, width: "100%" }),
              menu: (base) => ({ ...base, marginTop: "20px" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "var(--dark, #212529)"
                  : "white",
                color: state.isFocused ? "white" : "var(--dark, #212529)",
                "&:hover": {
                  backgroundColor: "var(--dark, #212529)",
                  color: "white",
                },
              }),
            }}
          />

          <button className="add-customer-btn" onClick={onAddCustomerClick}>
            Add New Customer
          </button>
        </div>

        {actions}

        {showScanProduct && (
          <div className="d-flex justify-content-end">
            <button
              className="notes-btn"
              onClick={onToggleNotes}
              title={showNotes ? "Hide Notes" : "Notes / Remarks"}
            >
              {showNotes ? "Hide Notes" : "Notes"}
            </button>

            <button className="scan-btn" onClick={onOpenScanModal}>
              Scan Product
            </button>
          </div>
        )}
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
                style={{ marginRight: "8px", color: "var(--dark)" }}
              />
              <span id="customerName">{customer.name}</span>
            </div>
            {customer.email && (
              <div className="customer-detail">
                <FaEnvelope
                  style={{ marginRight: "8px", color: "var(--dark)" }}
                />
                <span id="customerEmail">{customer.email ?? "-"}</span>
              </div>
            )}
            {customer.phoneNumber && (
              <div className="customer-detail">
                <FaPhone style={{ marginRight: "8px", color: "var(--dark)" }} />
                <span id="customerPhone">{customer.phoneNumber ?? "-"}</span>
              </div>
            )}
            {customer.birthday && (
              <div className="customer-detail">
                <FaBirthdayCake
                  style={{ marginRight: "8px", color: "var(--dark)" }}
                />
                <span id="customerBirthday">{customer.birthday ?? "-"}</span>
              </div>
            )}
            <div className="customer-detail">
              <span className="stat-pill">
                {customer.totalProductsPurchased ?? 0} items purchased
              </span>
            </div>
            <div className="customer-detail">
              <span className="stat-pill highlight">
                $
                {(customer.totalPurchasesValue ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                Lifetime Spent
              </span>
            </div>
          </div>
        </div>
      )}

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        callGetCustomerDetails={() => {}}
        setSearchInput={setSearchInput}
        setCustomer={setCustomer}
        setCustomerInfoActive={setCustomerInfoActive}
      />
    </div>
  );
};

export default CustomerSection;
