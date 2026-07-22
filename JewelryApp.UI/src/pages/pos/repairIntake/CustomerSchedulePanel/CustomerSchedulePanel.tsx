import { useEffect, useRef, useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { getCustomers } from "../../../../apis/customers.api/customers.api";
import type { Customer } from "../../posSale/types";
import { formatPhone, getInitials } from "../RepairIntake.utils";
import "./customerSchedulePanel.scss";

interface CustomerSchedulePanelProps {
  customer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddCustomerClick: () => void;
  nextSlot: number;
  dueDate: string;
  onDueDateChange: (value: string) => void;
  receiverDifferent: boolean;
  onReceiverDifferentChange: (value: boolean) => void;
  receiverName: string;
  onReceiverNameChange: (value: string) => void;
  saveLabel: string;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const CustomerSchedulePanel = ({
  customer,
  onSelectCustomer,
  onAddCustomerClick,
  nextSlot,
  dueDate,
  onDueDateChange,
  receiverDifferent,
  onReceiverDifferentChange,
  receiverName,
  onReceiverNameChange,
  saveLabel,
  canSave,
  onSave,
  onCancel,
}: CustomerSchedulePanelProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchInput.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await getCustomers({
          searchBy: searchInput,
          pageSize: 5,
          pageNumber: 1,
        });
        setResults(response.data ?? []);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const handlePickCustomer = (picked: Customer) => {
    onSelectCustomer(picked);
    setSearchInput("");
    setResults([]);
    setIsSearchFocused(false);
  };

  return (
    <div className="ri-right">
      <div className="ri-panel">
        {customer ? (
          <>
            <div className="ri-panel-label">Customer</div>
            <div className="ri-cust-sel">
              <div className="ri-cust-av">{getInitials(customer.name)}</div>
              <div className="ri-cust-info">
                <div className="ri-cust-nm">{customer.name}</div>
                <div className="ri-cust-ph">
                  {formatPhone(customer.phoneNumber)}
                </div>
              </div>
              <button
                className="ri-cust-x"
                onClick={() => onSelectCustomer(null)}
              >
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ri-panel-label">Customer *</div>
            <div className="ri-cust-search-wrap">
              <FaSearch className="ri-cust-search-ico" />
              <input
                type="text"
                className="ri-cust-search"
                placeholder="Search customer..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                autoComplete="off"
              />
              {isSearchFocused && !!results.length && (
                <div className="ri-cust-drop">
                  {results.map((c) => (
                    <div
                      key={c.id}
                      className="ri-cust-opt"
                      onMouseDown={() => handlePickCustomer(c)}
                    >
                      <span>{c.name}</span>
                      <span className="ri-cust-opt-ph">
                        {formatPhone(c.phoneNumber)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="ri-btn ri-btn-outline ri-cust-add-btn"
              onClick={onAddCustomerClick}
            >
              <FaPlus /> New customer
            </button>
          </>
        )}
      </div>

      <div className="ri-panel">
        <div className="ri-panel-label">Slot assignment</div>
        <div className="ri-slot-badge">
          <span className="ri-slot-num">{nextSlot}</span>
          <div>
            <div className="ri-slot-text">Slot {nextSlot}</div>
            <div className="ri-slot-sub">Next available</div>
          </div>
        </div>
      </div>

      <div className="ri-panel">
        <div className="ri-panel-label">Schedule</div>
        <div className="ri-fg">
          <label>Due date *</label>
          <input
            type="date"
            value={dueDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="ri-panel">
        <div
          className="ri-recv-row"
          onClick={() => onReceiverDifferentChange(!receiverDifferent)}
        >
          <input
            type="checkbox"
            checked={receiverDifferent}
            onChange={(e) => onReceiverDifferentChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="ri-recv-label">
            Receiver is different from customer
          </span>
        </div>
        {receiverDifferent && (
          <div className="ri-recv-name">
            <input
              type="text"
              placeholder="Enter receiver name"
              value={receiverName}
              onChange={(e) => onReceiverNameChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <button className="ri-save-btn" disabled={!canSave} onClick={onSave}>
        {saveLabel}
      </button>
      <div className="ri-cancel-link" onClick={onCancel}>
        Cancel
      </div>
    </div>
  );
};

export default CustomerSchedulePanel;
