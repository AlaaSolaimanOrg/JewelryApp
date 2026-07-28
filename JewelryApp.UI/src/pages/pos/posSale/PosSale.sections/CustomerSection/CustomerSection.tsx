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
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import AsyncSelect from "react-select/async";
import { getCustomers } from "../../../../../apis/customers.api/customers.api";
import AddCustomerModal from "../../../../../components/modals/AddCustomerModal/AddCustomerModal";
import type { Customer } from "../../types";
import { getCustomerTier, getInitials } from "./CustomerSection.utils";
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
  setCustomerInfoActive: (v: boolean) => void;
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
  setCustomerInfoActive,
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

  const clearCustomer = () => {
    setCustomerInfoActive(false);
    setCustomer(null);
    setSearchInput("");
  };

  return (
    <div id="customerSection" className="ps-panel">
      <h2 className="ps-panel-label">Customer</h2>

      {customer ? (
        <div className={`ps-cust-sel${customerInfoActive ? " active" : ""}`}>
          <div className="ps-cust-av">{getInitials(customer.name)}</div>
          <div className="ps-cust-info">
            <div className="ps-cust-name-row">
              <span className="ps-cust-nm" title={customer.name}>
                {customer.name}
              </span>
              {(() => {
                const tier = getCustomerTier(customer.totalPurchasesValue ?? 0);
                return (
                  <span className={`ps-tier-badge ${tier.className}`}>
                    {tier.isVip ? (
                      <span className="ps-tb-label">VIP</span>
                    ) : (
                      tier.name
                    )}
                  </span>
                );
              })()}
            </div>

            {customer.phoneNumber && (
              <div className="ps-cust-ph">
                <FaPhone /> {customer.phoneNumber}
              </div>
            )}
            {customer.email && (
              <div className="ps-cust-detail">
                <FaEnvelope /> {customer.email}
              </div>
            )}
            {customer.birthday && (
              <div className="ps-cust-detail">
                <FaBirthdayCake /> {customer.birthday}
              </div>
            )}

            <div className="ps-cust-stats">
              <span className="ps-cust-stat-tag">
                {customer.totalProductsPurchased ?? 0} items purchased
              </span>
              <span className="ps-cust-stat-tag highlight">
                $
                {(customer.totalPurchasesValue ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                lifetime
              </span>
            </div>
          </div>
          <button className="ps-cust-x" onClick={clearCustomer}>
            <FaTimes />
          </button>
        </div>
      ) : (
        <>
          <div className="ps-cust-search-wrap">
            <FaSearch className="ps-cust-search-ico" />
            <AsyncSelect
              className="ps-cust-search"
              cacheOptions
              loadOptions={loadOptions} // <-- Debounced search
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              defaultOptions
              placeholder="Search customer..."
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
                  clearCustomer();
                }
              }}
              value={null}
              isClearable
              classNamePrefix="ps-cust-rs"
            />
          </div>

          <button
            className="ps-btn ps-btn-outline ps-cust-add-btn"
            onClick={onAddCustomerClick}
          >
            + New customer
          </button>
        </>
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
