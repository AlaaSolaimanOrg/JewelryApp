import { useRef, useState } from "react";
import {
  FaMoneyBillWave,
  FaUndoAlt,
  FaTools,
  FaCoins,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { GiCardPickup, GiGoldBar } from "react-icons/gi";
import { Row, Col } from "react-bootstrap";
import { getRepairs } from "../../../apis/repairs.api";
import { getPosDashboardStats } from "../../../apis/dashboard.api";
import { getTodaySalesSummary } from "../../../apis/sales.api";
import { getUsedGoldSummary } from "../../../apis/usedGold.api";
import { verifySalesPin } from "../../../apis/securitySettings.api";
import PinPad from "../../../components/PinPad/PinPad";
import ActionCard from "../../../components/cards/ActionCard/ActionCard";
import StatCard from "../../../components/StatCard/StatCard";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { RepairStatus, SortDirection } from "../../../types/enums";
import { checkRequestSucceeded, showError } from "../../../utils";
import RepairsModal from "./RepairsModal/RepairsModal";
import { getDueStatus, type Repair } from "./RepairsModal/RepairsModal.utils";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import type {
  PosDashboardStats,
  TodaySalesSummary,
  UsedGoldSummary,
} from "./PosDashboard.type";
import { formatCurrency, formatCurrencyShort } from "./PosDashboard.utils";
import "./posDashboard.scss";

const EMPTY_STATS: PosDashboardStats = {
  storeCashBalance: 0,
  storeCashTodayDelta: 0,
};

const EMPTY_SALES_SUMMARY: TodaySalesSummary = {
  todaySalesTotal: 0,
  todaySalesCount: 0,
};

const EMPTY_GOLD_SUMMARY: UsedGoldSummary = {
  usedGoldWeight: 0,
  usedGoldAverageKarat: 0,
  usedGoldValue: 0,
};

type PendingReveal = "sales" | "gold" | null;

const PosDashboard = () => {
  const { data: repairs, isLoading: repairsLoading } =
    useLocalApiSearchSortPagination<Repair>({
      apiToCall: (data) => getRepairs(data.payload),
      extraPayload: { status: RepairStatus.InProgress },
      initialPageSize: 50,
      initialSortBy: "dueDate",
      initialSortDirection: SortDirection.Ascending,
    });

  const { data: stats } = useLocalApi({
    apiToCall: () => getPosDashboardStats(),
    dataInitalValue: EMPTY_STATS,
  }) as { data: PosDashboardStats };

  const [repairsModalOpen, setRepairsModalOpen] = useState(false);
  const [pendingReveal, setPendingReveal] = useState<PendingReveal>(null);

  const [salesRevealed, setSalesRevealed] = useState(false);
  const [salesSummary, setSalesSummary] =
    useState<TodaySalesSummary>(EMPTY_SALES_SUMMARY);
  const salesRevealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [goldRevealed, setGoldRevealed] = useState(false);
  const [goldSummary, setGoldSummary] =
    useState<UsedGoldSummary>(EMPTY_GOLD_SUMMARY);
  const goldRevealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const overdueCount =
    repairs?.filter((r) => getDueStatus(r.dueDate) === "overdue").length ?? 0;

  const openSalesReveal = () => {
    if (salesRevealed) return;
    setPendingReveal("sales");
  };

  const openGoldReveal = () => {
    if (goldRevealed) return;
    setPendingReveal("gold");
  };

  const closePinOverlay = () => {
    setPendingReveal(null);
  };

  const hideSales = () => {
    setSalesRevealed(false);
    setSalesSummary(EMPTY_SALES_SUMMARY);
  };

  const hideGold = () => {
    setGoldRevealed(false);
    setGoldSummary(EMPTY_GOLD_SUMMARY);
  };

  const handlePinSuccess = async (pin: string) => {
    const reveal = pendingReveal;
    setPendingReveal(null);

    if (reveal === "sales") {
      const response = await getTodaySalesSummary({ pin });
      if (checkRequestSucceeded(response?.statusCode)) {
        setSalesSummary(response.data);
        setSalesRevealed(true);
        if (salesRevealTimer.current) clearTimeout(salesRevealTimer.current);
        salesRevealTimer.current = setTimeout(hideSales, 60000);
      } else {
        showError(response?.message || "Failed to load sales");
      }
    } else if (reveal === "gold") {
      const response = await getUsedGoldSummary({ pin });
      if (checkRequestSucceeded(response?.statusCode)) {
        setGoldSummary(response.data);
        setGoldRevealed(true);
        if (goldRevealTimer.current) clearTimeout(goldRevealTimer.current);
        goldRevealTimer.current = setTimeout(hideGold, 60000);
      } else {
        showError(response?.message || "Failed to load used gold summary");
      }
    }
  };

  const handleVerifyPin = async (pin: string) => {
    const response = await verifySalesPin({ pin });
    if (checkRequestSucceeded(response?.statusCode)) return true;
    showError(response?.message || "Incorrect PIN");
    return false;
  };

  return (
    <div className="pos-dashboard">
      <Row className="g-3 dash-actions-grid">
        <Col xs={6} md={4}>
          <ActionCard
            to="/sale"
            icon={<FaMoneyBillWave />}
            label="Start new sale"
            sub="Ring up items and process payment"
          />
        </Col>
        <Col xs={6} md={4}>
          <ActionCard
            to="/return"
            icon={<FaUndoAlt />}
            label="Process return"
            sub="Search transaction and refund"
          />
        </Col>
        <Col xs={6} md={4}>
          <ActionCard
            to="/repair"
            icon={<FaTools />}
            label="New repair"
            sub="Log a repair order"
          />
        </Col>
        <Col xs={6} md={4}>
          <ActionCard
            to="/pickup"
            icon={<GiCardPickup />}
            label="Repair pickup"
            sub="Manage and complete repairs"
          />
        </Col>
        <Col xs={6} md={4}>
          <ActionCard
            to="/usedgold"
            icon={<GiGoldBar />}
            label="Used gold"
            sub="Buy gold from customers"
          />
        </Col>
        <Col xs={6} md={4}>
          <ActionCard
            to="/cashManagement"
            icon={<FaCoins />}
            label="Cash management"
            sub="Expenses, transfers, store box"
          />
        </Col>
      </Row>

      <Row className="g-3 dash-stats-grid">
        <Col xs={6} md={3}>
          <StatCard
            label="Today's sales"
            value={formatCurrency(salesSummary.todaySalesTotal)}
            valueColor="var(--pos-green)"
            sub={`${salesSummary.todaySalesCount} transactions`}
            clickable
            blurred
            revealed={salesRevealed}
            lockIcon={salesRevealed ? <FaLockOpen /> : <FaLock />}
            onClick={openSalesReveal}
          />
        </Col>

        <Col xs={6} md={3}>
          <StatCard
            label="Store cash box"
            value={formatCurrency(stats.storeCashBalance)}
            valueColor="var(--pos-green)"
            sub={`${formatCurrencyShort(stats.storeCashTodayDelta)} today`}
          />
        </Col>

        <Col xs={6} md={3}>
          <StatCard
            label="In progress repairs"
            value={repairs?.length ?? 0}
            clickable
            onClick={() => setRepairsModalOpen(true)}
            sub={
              <>
                {overdueCount > 0 && (
                  <span style={{ color: "var(--pos-red)" }}>
                    {overdueCount} overdue
                  </span>
                )}
                {overdueCount > 0 ? " · " : ""}tap to view
              </>
            }
          />
        </Col>

        <Col xs={6} md={3}>
          <StatCard
            label="Used gold on hand"
            value={`${goldSummary.usedGoldWeight.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}g`}
            valueColor="var(--pos-gold)"
            sub={`Avg ${goldSummary.usedGoldAverageKarat.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}K · ${formatCurrency(goldSummary.usedGoldValue)} value`}
            clickable
            blurred
            revealed={goldRevealed}
            lockIcon={goldRevealed ? <FaLockOpen /> : <FaLock />}
            onClick={openGoldReveal}
          />
        </Col>
      </Row>

      <RecentTransactions />

      <RepairsModal
        show={repairsModalOpen}
        onClose={() => setRepairsModalOpen(false)}
        repairs={repairs}
        isLoading={repairsLoading}
      />

      <PinPad
        show={pendingReveal !== null}
        onVerify={handleVerifyPin}
        title={
          pendingReveal === "gold"
            ? "View used gold on hand"
            : "View today's sales"
        }
        onSuccess={handlePinSuccess}
        onCancel={closePinOverlay}
      />
    </div>
  );
};

export default PosDashboard;
