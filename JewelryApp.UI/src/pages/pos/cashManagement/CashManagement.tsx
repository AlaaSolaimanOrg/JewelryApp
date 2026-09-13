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
import StatCard from "../../../components/StatCard/StatCard";
import PinPad from "../../../components/PinPad/PinPad";
import useLocalApi from "../../../hooks/useLocalApi";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import { CashBoxType } from "../../../types/enums";
import {
  getCashBalances,
  addExpense,
  manualCashIn,
  transferIncome,
  moveMoney,
} from "../../../apis/cashManagement.api/cashManagement.api";
import { verifySalesPin } from "../../../apis/securitySettings.api/securitySettings.api";
import TransactionLogs from "./TransactionLogs/TransactionLogs";
import ExpenseModal from "./modals/ExpenseModal/ExpenseModal";
import MoveMoneyModal, {
  type MoveDirection,
} from "./modals/MoveMoneyModal/MoveMoneyModal";
import TransferIncomeModal from "./modals/TransferIncomeModal/TransferIncomeModal";
import ManualCashInModal from "./modals/ManualCashInModal/ManualCashInModal";
import {
  TODAY,
  formatCurrency,
  formatCurrencyShort,
} from "./CashManagement.utils";
import "./cashManagement.scss";

interface CashBalances {
  storeBalance: number;
  transferBalance: number;
  storeTodayIn: number;
  storeTodayOut: number;
  transferTodayIn: number;
  transferTodayOut: number;
}

const EMPTY_BALANCES: CashBalances = {
  storeBalance: 0,
  transferBalance: 0,
  storeTodayIn: 0,
  storeTodayOut: 0,
  transferTodayIn: 0,
  transferTodayOut: 0,
};

interface PendingExpense {
  cat: string;
  amount: number;
  notes: string;
}

const CashManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: balances } = useLocalApi({
    apiToCall: () => getCashBalances(),
    dataInitalValue: EMPTY_BALANCES,
    effectDependency: [refreshKey],
  }) as { data: CashBalances };

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pendingExpense, setPendingExpense] = useState<PendingExpense | null>(
    null,
  );

  const refresh = () => setRefreshKey((k) => k + 1);

  const finalizeExpense = async (cat: string, amount: number, notes: string) => {
    const response = await addExpense({ category: cat, amount, notes });
    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(response?.message || `Expense added: ${cat} — ${formatCurrency(amount)}`);
      refresh();
    } else {
      showError(response?.message || "Failed to add expense");
    }
  };

  const handleExpenseSubmit = (cat: string, amount: number, notes: string) => {
    if (!cat) return showError("Select a category");
    if (amount <= 0) return showError("Enter an amount");
    if (!notes) return showError("Notes are required");
    if (amount > balances.storeBalance)
      return showError(`Store box only has ${formatCurrency(balances.storeBalance)}`);

    if (cat === "Owner Withdrawal") {
      setPendingExpense({ cat, amount, notes });
      setExpenseOpen(false);
      setPinOpen(true);
      return;
    }

    finalizeExpense(cat, amount, notes);
    setExpenseOpen(false);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    if (pendingExpense) {
      finalizeExpense(pendingExpense.cat, pendingExpense.amount, pendingExpense.notes);
      setPendingExpense(null);
    }
  };

  const handlePinCancel = () => {
    setPinOpen(false);
    setPendingExpense(null);
  };

  const handleVerifyOwnerPin = async (pin: string) => {
    const response = await verifySalesPin({ pin });
    if (checkRequestSucceeded(response?.statusCode)) return true;
    showError(response?.message || "Incorrect PIN");
    return false;
  };

  const handleMoveSubmit = async (
    direction: MoveDirection,
    amount: number,
    reason: string,
  ) => {
    if (amount <= 0) return showError("Enter an amount");

    const fromBox = direction === "t2s" ? CashBoxType.Transfers : CashBoxType.Store;
    const fromBalance =
      direction === "t2s" ? balances.transferBalance : balances.storeBalance;
    const fromLabel = direction === "t2s" ? "Transfers" : "Store";

    if (amount > fromBalance)
      return showError(`${fromLabel} box only has ${formatCurrency(fromBalance)}`);

    const response = await moveMoney({ fromBox, amount, reason });
    if (checkRequestSucceeded(response?.statusCode)) {
      setMoveOpen(false);
      showSuccess(
        response?.message ||
          `Moved ${formatCurrency(amount)} ${
            direction === "t2s" ? "Transfers → Store" : "Store → Transfers"
          }`,
      );
      refresh();
    } else {
      showError(response?.message || "Failed to move money");
    }
  };

  const handleTransferSubmit = async (
    customerName: string,
    amount: number,
    destination: string,
    notes: string,
  ) => {
    if (!customerName) return showError("Enter customer name");
    if (amount <= 0) return showError("Enter an amount");

    const response = await transferIncome({
      customerName,
      amount,
      destination,
      notes,
    });
    if (checkRequestSucceeded(response?.statusCode)) {
      setTransferOpen(false);
      showSuccess(
        response?.message ||
          `Transfer income: ${formatCurrency(amount)} from ${customerName}`,
      );
      refresh();
    } else {
      showError(response?.message || "Failed to record transfer income");
    }
  };

  const handleManualSubmit = async (
    source: string,
    amount: number,
    notes: string,
  ) => {
    if (!source) return showError("Select a source");
    if (amount <= 0) return showError("Enter an amount");

    const response = await manualCashIn({ source, amount, notes });
    if (checkRequestSucceeded(response?.statusCode)) {
      setManualOpen(false);
      showSuccess(response?.message || `Cash in: ${formatCurrency(amount)} — ${source}`);
      refresh();
    } else {
      showError(response?.message || "Failed to record cash in");
    }
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
            value={formatCurrency(balances.storeBalance)}
            valueColor="var(--pos-green)"
            accentColor="var(--pos-green)"
            sub={
              <div className="cash-box-sub">
                <div className="cash-box-row">
                  <span>Today in</span>
                  <span className="cash-box-in">
                    +{formatCurrencyShort(balances.storeTodayIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(balances.storeTodayOut)}
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
            value={formatCurrency(balances.transferBalance)}
            valueColor="var(--pos-blue)"
            accentColor="var(--pos-blue)"
            sub={
              <div className="cash-box-sub">
                <div className="cash-box-row">
                  <span>Today in</span>
                  <span className="cash-box-in">
                    +{formatCurrencyShort(balances.transferTodayIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(balances.transferTodayOut)}
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

      <TransactionLogs refreshKey={refreshKey} />

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
        onVerify={handleVerifyOwnerPin}
        title="Owner authorization"
        subtitle="Enter 4-digit PIN to approve withdrawal"
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    </div>
  );
};

export default CashManagement;
