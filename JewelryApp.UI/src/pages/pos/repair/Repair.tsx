import { useState } from "react";
import CustomerSection from "../posSale/PosSale.sections/CustomerSection/CustomerSection";
import type { Customer } from "../posSale/types";
import "./repair.scss";
import RepairItemCard from "./RepairItemCard/RepairItemCard";

import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createRepair } from "../../../apis/repairs.api/repairs.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import { PaymentStatus } from "../../../types/enums";
import RepairInvoiceModal from "../../../components/modals/RepairInvoiceModal/RepairInvoiceModal";


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
  paymentStatus: PaymentStatus | "";
  depositPaid: string;
  dueDate: string;
}

const itemsInitialValue: RepairItem[] = [
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
    paymentStatus: PaymentStatus.Unpaid,
    depositPaid: "",
    dueDate: "",
  },
];

const Repair = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [errors, setErrors] = useState<
    Record<number, Partial<Record<keyof RepairItem, string>>>
  >({});

  const [items, setItems] = useState<RepairItem[]>(itemsInitialValue);

  // 🔥 NEW STATES FOR INVOICE MODAL
  const [showInvoice, setShowInvoice] = useState(false);
  const [createdRepairId, setCreatedRepairId] = useState<string | null>(null);

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
        paymentStatus: PaymentStatus.Unpaid,
        depositPaid: "",
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

  const validateItems = () => {
    const newErrors: Record<number, any> = {};

    items.forEach((item) => {
      const err: any = {};
      if (!item.itemType) err.itemType = "Item type is required";
      if (!item.metal) err.metal = "Metal is required";
      if (!item.repairType) err.repairType = "Repair type is required";
      if (!item.dueDate) err.dueDate = "Due date is required";

      if (Object.keys(err).length > 0) newErrors[item.id] = err;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRepair = async () => {
    if (!customer) {
      showError("Select a customer first");
      return;
    }

    if (!validateItems()) {
      showError("Please fill required fields");
      return;
    }

    const payload = {
      customerId: customer.id,
      notes: "",
      items: items.map((i) => {
        const paymentStatusNum = Number(i.paymentStatus);
        const cost = Number(i.cost) || 0;

        let depositPaid = 0;
        if (paymentStatusNum === PaymentStatus.Unpaid) depositPaid = 0;
        else if (paymentStatusNum === PaymentStatus.Paid) depositPaid = cost;
        else if (paymentStatusNum === PaymentStatus.Partial)
          depositPaid = Number(i.depositPaid) || 0;

        return {
          itemType: Number(i.itemType),
          metal: Number(i.metal),
          weight: Number(i.weight) || 0,
          repairType: Number(i.repairType),
          stoneType: i.stone,
          notes: i.notes,
          cost: cost,
          urgentFee: Number(i.urgent) || 0,
          discount: Number(i.discount) || 0,
          paymentStatus: paymentStatusNum,
          depositPaid: depositPaid,
          dueDate: i.dueDate || null,
        };
      }),
    };

    try {
      const response = await createRepair(payload);

      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message);

        // 🔥 OPEN INVOICE MODAL WITH REPAIR ID
        setCreatedRepairId(response.data);
        setShowInvoice(true);

        // Reset
        setItems(itemsInitialValue);
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
          <span>Repair Items</span>
          <button className="add-item-btn" onClick={addItem}>
            <FaPlus /> Add Item
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
            errors={errors[item.id] || {}}
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

      {/* 🔥 INVOICE MODAL */}
      {createdRepairId && (
        <RepairInvoiceModal
          repairId={createdRepairId}
          show={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default Repair;
