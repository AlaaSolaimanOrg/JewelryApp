import { useState } from "react";
import CustomerSection from "../posSale/PosSale.sections/CustomerSection/CustomerSection";
import type { Customer } from "../posSale/types";
import "./repair.scss";
import RepairItemCard from "./RepairItemCard/RepairItemCard";

import { FaArrowLeft, FaPlus, FaRing, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createRepair } from "../../../apis/repairs.api/repairs.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";

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
  const navigate = useNavigate();
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

  const handleSaveRepair = async () => {
    if (!customer) {
      alert("Select a customer first");
      return;
    }

    const payload = {
      customerId: customer.id,
      notes: "",
      items: items.map((i) => ({
        itemType: Number(i.itemType),
        metal: Number(i.metal),
        weight: Number(i.weight) || 0,
        repairType: Number(i.repairType),
        stoneType: i.stone,
        notes: i.notes,
        cost: Number(i.cost) || 0,
        urgentFee: Number(i.urgent) || 0,
        discount: Number(i.discount) || 0,
        dueDate: i.dueDate || null,
      })),
    };

    try {
      const response = await createRepair(payload);
      console.log("response", response);
      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message);
        setItems([]);
        setCustomer(null);
        setCustomerInfoActive(false);
      } else {
        showError(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="repair-page" className="page-content">
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
        actions={
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft /> Back to POS
          </button>
        }
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

        {items.map((item, index) => (
          <RepairItemCard
            key={item.id}
            item={item}
            updateItem={updateItem}
            removeItem={removeItem}
            calculateItemTotal={calculateItemTotal}
            itemsCount={items.length}
            cardNumber={index + 1}
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
        <button className="save-btn" onClick={handleSaveRepair}>
          Save Repair
        </button>

        <button className="cancel-btn" onClick={() => history.back()}>
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default Repair;
