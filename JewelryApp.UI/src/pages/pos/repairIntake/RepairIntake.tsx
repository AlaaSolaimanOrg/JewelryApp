import { useRef, useState } from "react";
import { FaArrowLeft, FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createRepair, getRepairs } from "../../../apis/repairs.api/repairs.api";
import RepairInvoiceModal from "../../../components/modals/RepairInvoiceModal/RepairInvoiceModal";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { RepairPayMethod, RepairStatus } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import type { Customer } from "../posSale/types";
import AddCustomerModal from "./AddCustomerModal/AddCustomerModal";
import CustomerSchedulePanel from "./CustomerSchedulePanel/CustomerSchedulePanel";
import RepairDetailsPanel from "./RepairDetailsPanel/RepairDetailsPanel";
import {
  formatCurrency,
  getNextAvailableSlot,
  payMethodToPaymentStatus,
} from "./RepairIntake.utils";
import "./repairIntake.scss";

const RepairIntake = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("0");
  const [payMethod, setPayMethod] = useState<RepairPayMethod>(
    RepairPayMethod.Unpaid,
  );
  const [cashAmount, setCashAmount] = useState("0");
  const [cardAmount, setCardAmount] = useState("0");
  const lastPayEdited = useRef<"cash" | "card">("cash");
  const [dueDate, setDueDate] = useState("");
  const [receiverDifferent, setReceiverDifferent] = useState(false);
  const [receiverName, setReceiverName] = useState("");

  const [showInvoice, setShowInvoice] = useState(false);
  const [createdRepairId, setCreatedRepairId] = useState<string | null>(null);

  const { data: inProgressRepairs } = useLocalApiSearchSortPagination<{
    slotNumber: number | null;
  }>({
    apiToCall: (data) => getRepairs(data.payload),
    extraPayload: { status: RepairStatus.InProgress },
    initialPageSize: 50,
  });

  const occupiedSlots = (inProgressRepairs ?? [])
    .map((r) => r.slotNumber)
    .filter((n): n is number => typeof n === "number");
  const nextSlot = getNextAvailableSlot(occupiedSlots);

  const recalcPayFields = (method: RepairPayMethod, costValue: number) => {
    if (method === RepairPayMethod.Cash) {
      setCashAmount(costValue.toFixed(2));
      setCardAmount("0");
    } else if (method === RepairPayMethod.Card) {
      setCashAmount("0");
      setCardAmount(costValue.toFixed(2));
    } else if (method === RepairPayMethod.Split) {
      if (lastPayEdited.current === "cash") {
        setCardAmount(
          Math.max(0, costValue - (parseFloat(cashAmount) || 0)).toFixed(2),
        );
      } else {
        setCashAmount(
          Math.max(0, costValue - (parseFloat(cardAmount) || 0)).toFixed(2),
        );
      }
    }
  };

  const handlePayMethodChange = (method: RepairPayMethod) => {
    setPayMethod(method);
    lastPayEdited.current = "cash";
    recalcPayFields(method, parseFloat(cost) || 0);
  };

  const handleCostChange = (value: string) => {
    setCost(value);
    recalcPayFields(payMethod, parseFloat(value) || 0);
  };

  const handleCashAmountChange = (value: string) => {
    setCashAmount(value);
    if (payMethod !== RepairPayMethod.Split) return;
    lastPayEdited.current = "cash";
    const costValue = parseFloat(cost) || 0;
    const cashValue = parseFloat(value) || 0;
    setCardAmount(Math.max(0, costValue - cashValue).toFixed(2));
  };

  const handleCardAmountChange = (value: string) => {
    setCardAmount(value);
    if (payMethod !== RepairPayMethod.Split) return;
    lastPayEdited.current = "card";
    const costValue = parseFloat(cost) || 0;
    const cardValue = parseFloat(value) || 0;
    setCashAmount(Math.max(0, costValue - cardValue).toFixed(2));
  };

  const resetForm = () => {
    setCustomer(null);
    setNotes("");
    setCost("0");
    setPayMethod(RepairPayMethod.Unpaid);
    setCashAmount("0");
    setCardAmount("0");
    lastPayEdited.current = "cash";
    setDueDate("");
    setReceiverDifferent(false);
    setReceiverName("");
  };

  const reasons: string[] = [];
  if (!customer) reasons.push("customer");
  if (!notes.trim()) reasons.push("notes");
  if (!dueDate) reasons.push("due date");

  const canSave = reasons.length === 0;
  const costValue = parseFloat(cost) || 0;
  const saveLabel = reasons.length
    ? `Missing: ${reasons.join(", ")}`
    : costValue > 0
      ? `Save repair — ${formatCurrency(costValue)}`
      : "Save repair";

  const handleSaveRepair = async () => {
    if (!canSave || !customer) return;

    const payload = {
      customerId: customer.id,
      notes: notes.trim(),
      cost: costValue,
      paymentStatus: payMethodToPaymentStatus(payMethod),
      cashAmount:
        payMethod === RepairPayMethod.Unpaid ? 0 : parseFloat(cashAmount) || 0,
      cardAmount:
        payMethod === RepairPayMethod.Unpaid ? 0 : parseFloat(cardAmount) || 0,
      dueDate: dueDate || null,
      receiverName:
        receiverDifferent && receiverName.trim()
          ? receiverName.trim()
          : null,
    };

    try {
      const response = await createRepair(payload);

      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message);
        setCreatedRepairId(response.data);
        setShowInvoice(true);
        resetForm();
      } else {
        showError(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="repair-intake-page">
      <div className="ri-top-bar">
        <span className="ri-top-title">
          <FaTools /> New repair
        </span>
        <Link to="/" className="ri-btn ri-btn-outline">
          <FaArrowLeft /> Back to POS
        </Link>
      </div>

      <div className="ri-main">
        <RepairDetailsPanel
          notes={notes}
          onNotesChange={setNotes}
          cost={cost}
          onCostChange={handleCostChange}
          payMethod={payMethod}
          onPayMethodChange={handlePayMethodChange}
          cashAmount={cashAmount}
          onCashAmountChange={handleCashAmountChange}
          cardAmount={cardAmount}
          onCardAmountChange={handleCardAmountChange}
        />

        <CustomerSchedulePanel
          customer={customer}
          onSelectCustomer={setCustomer}
          onAddCustomerClick={() => setShowAddCustomerModal(true)}
          nextSlot={nextSlot}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
          receiverDifferent={receiverDifferent}
          onReceiverDifferentChange={setReceiverDifferent}
          receiverName={receiverName}
          onReceiverNameChange={setReceiverName}
          saveLabel={saveLabel}
          canSave={canSave}
          onSave={handleSaveRepair}
          onCancel={() => history.back()}
        />
      </div>

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onAdded={setCustomer}
      />

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

export default RepairIntake;
