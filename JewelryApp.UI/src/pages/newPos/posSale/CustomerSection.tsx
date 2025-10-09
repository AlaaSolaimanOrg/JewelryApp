import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUserCircle,
} from "react-icons/fa";
import AddCustomerModal from "../../../components/AddCustomerModal/AddCustomerModal";
import type { Customer } from "./types";

interface Props {
  customer: Customer;
  customerInfoActive: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  onSearchEnter: (e: any) => void;
  onAddCustomerClick: () => void;
  showAddCustomerModal: boolean;
  setShowAddCustomerModal: (v: boolean) => void;
  onOpenScanModal: () => void;
}

const CustomerSection: React.FC<Props> = ({
  customer,
  customerInfoActive,
  searchInput,
  setSearchInput,
  onSearchEnter,
  onAddCustomerClick,
  showAddCustomerModal,
  setShowAddCustomerModal,
  onOpenScanModal,
}) => {
  return (
    <>
      <header className="header">
        <div className="logo">GoldCraft POS</div>
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder={`Search customer by ...`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={onSearchEnter}
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
            <span id="customerEmail">{customer.email}</span>
          </div>
          <div className="customer-detail">
            <FaPhone
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerPhone">{customer.phone}</span>
          </div>
          <div className="customer-detail">
            <FaBirthdayCake
              style={{ marginRight: "8px", color: "var(--primary-blue)" }}
            />
            <span id="customerBirthday">{customer.birthday}</span>
          </div>
        </div>
      </div>

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
      />
    </>
  );
};

export default CustomerSection;
