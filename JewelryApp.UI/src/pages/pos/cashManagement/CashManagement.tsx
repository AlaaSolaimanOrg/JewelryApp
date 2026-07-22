import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaCoins,
  FaStore,
  FaExchangeAlt,
  FaMinusCircle,
  FaPlusCircle,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import StatCard from "../../../components/3.0/StatCard/StatCard";
import PinPad from "../../../components/3.0/PinPad/PinPad";
import { showError, showSuccess } from "../../../utils";
import TransactionLogs from "./TransactionLogs/TransactionLogs";
import ExpenseModal from "./modals/ExpenseModal/ExpenseModal";
import MoveMoneyModal, {
  type MoveDirection,
} from "./modals/MoveMoneyModal/MoveMoneyModal";
import TransferIncomeModal from "./modals/TransferIncomeModal/TransferIncomeModal";
import ManualCashInModal from "./modals/ManualCashInModal/ManualCashInModal";
import {
  TODAY,
  INITIAL_STORE_BALANCE,
  INITIAL_TRANSFER_BALANCE,
  STATIC_TODAY_TOTALS,
  formatCurrency,
  formatCurrencyShort,
} from "./CashManagement.utils";
import "./cashManagement.scss";

const OWNER_PIN = "1234";

interface PendingExpense {
  cat: string;
  amount: number;
  notes: string;
}

const CashManagement = () => {
  const [storeBalance, setStoreBalance] = useState(INITIAL_STORE_BALANCE);
  const [transferBalance, setTransferBalance] = useState(
    INITIAL_TRANSFER_BALANCE,
  );

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pendingExpense, setPendingExpense] = useState<PendingExpense | null>(
    null,
  );

  const finalizeExpense = (cat: string, amount: number) => {
    setStoreBalance((b) => b - amount);
    showSuccess(`Expense added: ${cat} — ${formatCurrency(amount)}`);
  };

  const handleExpenseSubmit = (cat: string, amount: number, notes: string) => {
    if (!cat) return showError("Select a category");
    if (amount <= 0) return showError("Enter an amount");
    if (!notes) return showError("Notes are required");
    if (amount > storeBalance)
      return showError(`Store box only has ${formatCurrency(storeBalance)}`);

    if (cat === "Owner Withdrawal") {
      setPendingExpense({ cat, amount, notes });
      setExpenseOpen(false);
      setPinOpen(true);
      return;
    }

    finalizeExpense(cat, amount);
    setExpenseOpen(false);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    if (pendingExpense) {
      finalizeExpense(pendingExpense.cat, pendingExpense.amount);
      setPendingExpense(null);
    }
  };

  const handlePinCancel = () => {
    setPinOpen(false);
    setPendingExpense(null);
  };

  const handleMoveSubmit = (direction: MoveDirection, amount: number) => {
    if (amount <= 0) return showError("Enter an amount");

    if (direction === "t2s") {
      if (amount > transferBalance)
        return showError(
          `Transfers box only has ${formatCurrency(transferBalance)}`,
        );
      setTransferBalance((b) => b - amount);
      setStoreBalance((b) => b + amount);
    } else {
      if (amount > storeBalance)
        return showError(`Store box only has ${formatCurrency(storeBalance)}`);
      setStoreBalance((b) => b - amount);
      setTransferBalance((b) => b + amount);
    }

    setMoveOpen(false);
    showSuccess(
      `Moved ${formatCurrency(amount)} ${
        direction === "t2s" ? "Transfers → Store" : "Store → Transfers"
      }`,
    );
  };

  const handleTransferSubmit = (customerName: string, amount: number) => {
    if (!customerName) return showError("Enter customer name");
    if (amount <= 0) return showError("Enter an amount");

    setTransferBalance((b) => b + amount);
    setTransferOpen(false);
    showSuccess(`Transfer income: ${formatCurrency(amount)} from ${customerName}`);
  };

  const handleManualSubmit = (source: string, amount: number) => {
    if (!source) return showError("Select a source");
    if (amount <= 0) return showError("Enter an amount");

    setStoreBalance((b) => b + amount);
    setManualOpen(false);
    showSuccess(`Cash in: ${formatCurrency(amount)} — ${source}`);
  };

  return (
    <div className="cash-mgmt-page">
      <div className="cash-mgmt-header">
        <div className="cash-mgmt-header-left">
          <div className="cash-mgmt-icon">
            <FaCoins />
          </div>
          <span className="cash-mgmt-title">Cash management</span>
        </div>
        <div className="cash-mgmt-header-right">
          <span className="cash-mgmt-date">
            {new Date(TODAY).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link to="/" className="cash-btn cash-btn-outline">
            <FaArrowLeft /> Back to POS
          </Link>
        </div>
      </div>

      <Row className="g-2 cash-boxes">
        <Col xs={12} md={6}>
          <StatCard
            label="Store cash box"
            labelIcon={<FaStore />}
            value={formatCurrency(storeBalance)}
            valueColor="var(--pos-green)"
            accentColor="var(--pos-green)"
            sub={
              <div className="cash-box-sub">
                <div className="cash-box-row">
                  <span>Today in</span>
                  <span className="cash-box-in">
                    +{formatCurrencyShort(STATIC_TODAY_TOTALS.storeIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(STATIC_TODAY_TOTALS.storeOut)}
                  </span>
                </div>
              </div>
            }
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            label="Transfers cash box"
            labelIcon={<FaExchangeAlt />}
            value={formatCurrency(transferBalance)}
            valueColor="var(--pos-blue)"
            accentColor="var(--pos-blue)"
            sub={
              <div className="cash-box-sub">
                <div className="cash-box-row">
                  <span>Today in</span>
                  <span className="cash-box-in">
                    +{formatCurrencyShort(STATIC_TODAY_TOTALS.transferIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(STATIC_TODAY_TOTALS.transferOut)}
                  </span>
                </div>
              </div>
            }
          />
        </Col>
      </Row>

      <div className="cash-actions">
        <button
          className="cash-btn cash-btn-red"
          onClick={() => setExpenseOpen(true)}
        >
          <FaMinusCircle /> Add expense
        </button>
        <button
          className="cash-btn cash-btn-amber"
          onClick={() => setMoveOpen(true)}
        >
          <FaExchangeAlt /> Move money
        </button>
        <button
          className="cash-btn cash-btn-blue"
          onClick={() => setTransferOpen(true)}
        >
          <FaPaperPlane /> Transfer income
        </button>
        <button
          className="cash-btn cash-btn-green"
          onClick={() => setManualOpen(true)}
        >
          <FaPlusCircle /> Manual cash in
        </button>
      </div>

      <TransactionLogs />

      <ExpenseModal
        show={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        onSubmit={handleExpenseSubmit}
      />
      <MoveMoneyModal
        show={moveOpen}
        onClose={() => setMoveOpen(false)}
        onSubmit={handleMoveSubmit}
      />
      <TransferIncomeModal
        show={transferOpen}
        onClose={() => setTransferOpen(false)}
        onSubmit={handleTransferSubmit}
      />
      <ManualCashInModal
        show={manualOpen}
        onClose={() => setManualOpen(false)}
        onSubmit={handleManualSubmit}
      />

      <PinPad
        show={pinOpen}
        correctPin={OWNER_PIN}
        title="Owner authorization"
        subtitle="Enter 4-digit PIN to approve withdrawal"
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    </div>
  );
};

export default CashManagement;
