import { useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createRepair } from "../../../apis/repairs.api/repairs.api";
import RepairInvoiceModal from "../../../components/modals/RepairInvoiceModal/RepairInvoiceModal";
import { PaymentStatus } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import CustomerSection from "../posSale/PosSale.sections/CustomerSection/CustomerSection";
import type { Customer } from "../posSale/types";
import "./repair.scss";
import RepairItemCard from "./RepairItemCard/RepairItemCard";

export interface RepairForm {
  notes: string;
  cost: string;
  paymentStatus: PaymentStatus | "";
  dueDate: string;
}

const formInitialValue: RepairForm = {
  notes: "",
  cost: "",
  paymentStatus: PaymentStatus.Unpaid,
  dueDate: "",
};

const Repair = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerInfoActive, setCustomerInfoActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [form, setForm] = useState<RepairForm>(formInitialValue);
  const [errors, setErrors] = useState<Partial<Record<keyof RepairForm, string>>>({});

  const [showInvoice, setShowInvoice] = useState(false);
  const [createdRepairId, setCreatedRepairId] = useState<string | null>(null);

  const updateField = (field: keyof RepairForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const err: Partial<Record<keyof RepairForm, string>> = {};
    if (!form.notes) err.notes = "Notes are required";
    if (!form.dueDate) err.dueDate = "Due date is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveRepair = async () => {
    if (!customer) {
      showError("Select a customer first");
      return;
    }
    if (!validate()) {
      showError("Please fill required fields");
      return;
    }

    const payload = {
      customerId: customer.id,
      notes: form.notes,
      cost: Number(form.cost) || 0,
      paymentStatus: Number(form.paymentStatus),
      dueDate: form.dueDate || null,
    };

    try {
      const response = await createRepair(payload);

      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message);
        setCreatedRepairId(response.data);
        setShowInvoice(true);
        setForm(formInitialValue);
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
          <span>Repair</span>
        </div>

        <RepairItemCard
          form={form}
          updateField={updateField}
          errors={errors}
        />
      </div>

      <div className="footer-buttons">
        <button className="save-btn" onClick={handleSaveRepair}>
          Save Repair
        </button>
        <button className="cancel-btn" onClick={() => history.back()}>
          <FaTimes /> Cancel
        </button>
      </div>

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
