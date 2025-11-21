import { useState } from "react";
import CustomerSection from "../posSale/PosSale.sections/CustomerSection/CustomerSection";
import "./repair.scss";
import type { Customer } from "../posSale/types";
import RepairItemCard from "./RepairItemCard/RepairItemCard";

import { FaRing, FaPlus, FaPrint, FaTimes } from "react-icons/fa";

export interface RepairItem {
  id: number;
  itemType: string;
  metal: string;
  weight: string;
  stone: string;
  repairType: string;
  notes: string;
  cost: string;
  urgent: string;
  discount: string;
  paymentStatus: string;
  dueDate: string;
}

const Repair = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [items, setItems] = useState<RepairItem[]>([
    {
      id: 1,
      itemType: "",
      metal: "",
      weight: "",
      stone: "",
      repairType: "",
      notes: "",
      cost: "",
      urgent: "",
      discount: "",
      paymentStatus: "Not Paid",
      dueDate: "",
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        itemType: "",
        metal: "",
        weight: "",
        stone: "",
        repairType: "",
        notes: "",
        cost: "",
        urgent: "",
        discount: "",
        paymentStatus: "Not Paid",
        dueDate: "",
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof RepairItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateItemTotal = (item: RepairItem) => {
    return (
      (Number(item.cost) || 0) +
      (Number(item.urgent) || 0) -
      (Number(item.discount) || 0)
    );
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  return (
    <div className="repair-page">
      <CustomerSection
        customer={customer}
        setCustomer={setCustomer}
        customerInfoActive={customerInfoActive}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onAddCustomerClick={() => setShowAddCustomerModal(true)}
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
        onOpenScanModal={() => {}}
        setCustomerInfoActive={setCustomerInfoActive}
      />

      <div className="section">
        <div className="section-title">
          <span>
            <FaRing /> Repair Items
          </span>

          <button className="add-item-btn" onClick={addItem}>
            <FaPlus className="plus-icon" /> Add Item
          </button>
        </div>

        {items.map((item) => (
          <RepairItemCard
            key={item.id}
            item={item}
            updateItem={updateItem}
            removeItem={removeItem}
            calculateItemTotal={calculateItemTotal}
          />
        ))}

        <div className="summary-box">
          <div className="summary-line">
            <span>Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="footer-buttons">
        <button className="save-btn">Save Repair</button>
        <button className="print-btn">
          <FaPrint /> Print Receipt
        </button>
        <button className="cancel-btn" onClick={() => history.back()}>
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default Repair;
