import { useRef, useState } from "react";
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
import { getSalesList } from "../../../apis/sales.api/sales.api";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../types/enums";
import { showError, showSuccess } from "../../../utils";
import TransactionLog from "./TransactionLog/TransactionLog";
import ExpenseModal from "./modals/ExpenseModal/ExpenseModal";
import MoveMoneyModal, {
  type MoveDirection,
} from "./modals/MoveMoneyModal/MoveMoneyModal";
import TransferIncomeModal from "./modals/TransferIncomeModal/TransferIncomeModal";
import ManualCashInModal from "./modals/ManualCashInModal/ManualCashInModal";
import CorrectEntryModal from "./modals/CorrectEntryModal/CorrectEntryModal";
import VoidEntryModal from "./modals/VoidEntryModal/VoidEntryModal";
import {
  TODAY,
  INITIAL_LOG,
  INITIAL_STORE_BALANCE,
  INITIAL_TRANSFER_BALANCE,
  formatCurrency,
  formatCurrencyShort,
  getTodayTotals,
  mapSaleToLogEntry,
  type ApiSale,
  type LogEntry,
  type EntryDirection,
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
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);

  const { data: sales } = useLocalApiSearchSortPagination<ApiSale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 100,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  // Real sales (their cash portion) are merged in for display only — the box
  // balances below are only ever moved by the actions on this page, since
  // there's no backend cash-ledger yet to reconcile them against real sales
  const saleLogEntries = (sales ?? [])
    .filter((s) => s.cashAmount > 0)
    .map(mapSaleToLogEntry);

  const mergedLog = [...saleLogEntries, ...log].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const nextLogId = useRef(INITIAL_LOG.length + 1);
  const nextMoveGroup = useRef(1);

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [correctEntry, setCorrectEntry] = useState<LogEntry | null>(null);
  const [voidEntry, setVoidEntry] = useState<LogEntry | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [pendingExpense, setPendingExpense] = useState<PendingExpense | null>(
    null,
  );

  const todayTotals = getTodayTotals(mergedLog);

  const addLogEntry = (entry: Omit<LogEntry, "id">) => {
    setLog((prev) => [{ ...entry, id: nextLogId.current++ }, ...prev]);
  };

  const finalizeExpense = (cat: string, amount: number, notes: string) => {
    setStoreBalance((b) => b - amount);
    addLogEntry({
      date: TODAY,
      type: "out",
      box: "store",
      amount,
      desc: `Expense: ${cat}`,
      notes,
      cat,
      voided: false,
      entryType: "normal",
    });
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

    finalizeExpense(cat, amount, notes);
    setExpenseOpen(false);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    if (pendingExpense) {
      finalizeExpense(
        pendingExpense.cat,
        pendingExpense.amount,
        pendingExpense.notes,
      );
      setPendingExpense(null);
    }
  };

  const handlePinCancel = () => {
    setPinOpen(false);
    setPendingExpense(null);
  };

  const handleMoveSubmit = (
    direction: MoveDirection,
    amount: number,
    reason: string,
  ) => {
    if (amount <= 0) return showError("Enter an amount");
    const mg = nextMoveGroup.current++;

    if (direction === "t2s") {
      if (amount > transferBalance)
        return showError(
          `Transfers box only has ${formatCurrency(transferBalance)}`,
        );
      setTransferBalance((b) => b - amount);
      setStoreBalance((b) => b + amount);
      addLogEntry({
        date: TODAY,
        type: "out",
        box: "transfer",
        amount,
        desc: "Move to store box",
        notes: reason || "Moved to store",
        cat: "Move",
        voided: false,
        entryType: "normal",
        moveGroup: mg,
      });
      addLogEntry({
        date: TODAY,
        type: "in",
        box: "store",
        amount,
        desc: "Move from transfers box",
        notes: reason || "Moved from transfers",
        cat: "Move",
        voided: false,
        entryType: "normal",
        moveGroup: mg,
      });
    } else {
      if (amount > storeBalance)
        return showError(`Store box only has ${formatCurrency(storeBalance)}`);
      setStoreBalance((b) => b - amount);
      setTransferBalance((b) => b + amount);
      addLogEntry({
        date: TODAY,
        type: "out",
        box: "store",
        amount,
        desc: "Move to transfers box",
        notes: reason || "Moved to transfers",
        cat: "Move",
        voided: false,
        entryType: "normal",
        moveGroup: mg,
      });
      addLogEntry({
        date: TODAY,
        type: "in",
        box: "transfer",
        amount,
        desc: "Move from store box",
        notes: reason || "Moved from store",
        cat: "Move",
        voided: false,
        entryType: "normal",
        moveGroup: mg,
      });
    }

    setMoveOpen(false);
    showSuccess(
      `Moved ${formatCurrency(amount)} ${
        direction === "t2s" ? "Transfers → Store" : "Store → Transfers"
      }`,
    );
  };

  const handleTransferSubmit = (
    customerName: string,
    amount: number,
    destination: string,
    notes: string,
  ) => {
    if (!customerName) return showError("Enter customer name");
    if (amount <= 0) return showError("Enter an amount");

    setTransferBalance((b) => b + amount);
    const noteStr =
      (destination ? `Transfer to ${destination}` : "Transfer") +
      (notes ? ` — ${notes}` : "");
    addLogEntry({
      date: TODAY,
      type: "in",
      box: "transfer",
      amount,
      desc: `Transfer: ${customerName}`,
      notes: noteStr,
      cat: "Transfer",
      voided: false,
      entryType: "normal",
    });
    setTransferOpen(false);
    showSuccess(`Transfer income: ${formatCurrency(amount)} from ${customerName}`);
  };

  const handleManualSubmit = (source: string, amount: number, notes: string) => {
    if (!source) return showError("Select a source");
    if (amount <= 0) return showError("Enter an amount");

    setStoreBalance((b) => b + amount);
    addLogEntry({
      date: TODAY,
      type: "in",
      box: "store",
      amount,
      desc: `Manual: ${source}`,
      notes: notes || source,
      cat: source,
      voided: false,
      entryType: "normal",
    });
    setManualOpen(false);
    showSuccess(`Cash in: ${formatCurrency(amount)} — ${source}`);
  };

  const openCorrect = (id: number) => {
    const entry = log.find((l) => l.id === id);
    if (!entry || entry.voided) return;
    setCorrectEntry(entry);
  };

  const handleCorrectionSubmit = (newAmount: number, reason: string) => {
    if (!correctEntry) return;
    if (newAmount <= 0) return showError("Enter the correct amount");
    if (!reason) return showError("Reason is required");

    const diff = newAmount - correctEntry.amount;
    if (Math.abs(diff) < 0.01)
      return showError("Amount is the same — no correction needed");

    let adjType: EntryDirection;
    let adjAmount: number;
    if (correctEntry.type === "in") {
      if (diff > 0) {
        adjType = "in";
        adjAmount = diff;
      } else {
        adjType = "out";
        adjAmount = Math.abs(diff);
      }
    } else {
      if (diff > 0) {
        adjType = "out";
        adjAmount = diff;
      } else {
        adjType = "in";
        adjAmount = Math.abs(diff);
      }
    }

    if (correctEntry.box === "store") {
      setStoreBalance((b) => (adjType === "in" ? b + adjAmount : b - adjAmount));
    } else {
      setTransferBalance((b) =>
        adjType === "in" ? b + adjAmount : b - adjAmount,
      );
    }

    addLogEntry({
      date: TODAY,
      type: adjType,
      box: correctEntry.box,
      amount: adjAmount,
      desc: `Correction: ${correctEntry.desc}`,
      notes: `Original: ${formatCurrency(correctEntry.amount)} → Corrected to: ${formatCurrency(newAmount)}. Reason: ${reason}`,
      cat: "Correction",
      voided: false,
      entryType: "correction",
    });

    showSuccess(
      `Correction applied: ${adjType === "in" ? "+" : "-"}${formatCurrency(adjAmount)} to ${correctEntry.box} box`,
    );
    setCorrectEntry(null);
  };

  const openVoid = (id: number) => {
    const entry = log.find((l) => l.id === id);
    if (!entry || entry.voided) return;
    setVoidEntry(entry);
  };

  const handleVoidSubmit = (reason: string) => {
    if (!voidEntry) return;
    if (!reason) return showError("Reason is required");

    const targets =
      voidEntry.moveGroup !== undefined
        ? log.filter(
            (l) =>
              l.moveGroup === voidEntry.moveGroup &&
              !l.voided &&
              l.entryType === "normal",
          )
        : [voidEntry];

    setLog((prev) => {
      const voidedIds = new Set(targets.map((t) => t.id));
      const next = prev.map((l) =>
        voidedIds.has(l.id) ? { ...l, voided: true } : l,
      );
      const reversalEntries: LogEntry[] = targets.map((t) => ({
        id: nextLogId.current++,
        date: TODAY,
        type: t.type === "in" ? "out" : "in",
        box: t.box,
        amount: t.amount,
        desc: `Void: ${t.desc}`,
        notes: `Reversed voided entry. Reason: ${reason}`,
        cat: "Void",
        voided: false,
        entryType: "void-reversal",
      }));
      return [...reversalEntries, ...next];
    });

    targets.forEach((t) => {
      const revType: EntryDirection = t.type === "in" ? "out" : "in";
      if (t.box === "store") {
        setStoreBalance((b) => (revType === "in" ? b + t.amount : b - t.amount));
      } else {
        setTransferBalance((b) =>
          revType === "in" ? b + t.amount : b - t.amount,
        );
      }
    });

    showSuccess(
      targets.length > 1
        ? "Move voided — both sides reversed"
        : `Entry voided — ${formatCurrency(voidEntry.amount)} reversed in ${voidEntry.box} box`,
    );
    setVoidEntry(null);
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
                    +{formatCurrencyShort(todayTotals.storeIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(todayTotals.storeOut)}
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
                    +{formatCurrencyShort(todayTotals.transferIn)}
                  </span>
                </div>
                <div className="cash-box-row">
                  <span>Today out</span>
                  <span className="cash-box-out">
                    -{formatCurrencyShort(todayTotals.transferOut)}
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

      <TransactionLog log={mergedLog} onCorrect={openCorrect} onVoid={openVoid} />

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
      <CorrectEntryModal
        show={!!correctEntry}
        entry={correctEntry}
        onClose={() => setCorrectEntry(null)}
        onSubmit={handleCorrectionSubmit}
      />
      <VoidEntryModal
        show={!!voidEntry}
        entry={voidEntry}
        onClose={() => setVoidEntry(null)}
        onSubmit={handleVoidSubmit}
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
