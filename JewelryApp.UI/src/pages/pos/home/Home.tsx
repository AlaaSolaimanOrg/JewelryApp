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
import { getRepairs } from "../../../apis/repairs.api/repairs.api";
import PinPad from "../../../components/3.0/PinPad/PinPad";
import ActionCard from "../../../components/3.0/ActionCard/ActionCard";
import StatCard from "../../../components/3.0/StatCard/StatCard";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { RepairStatus, SortDirection } from "../../../types/enums";
import RepairsModal from "./RepairsModal/RepairsModal";
import { getDueStatus, type Repair } from "./RepairsModal/RepairsModal.utils";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import "./home.scss";

const SALES_PIN = "1234";

const Home = () => {
  const { data: repairs, isLoading: repairsLoading } =
    useLocalApiSearchSortPagination<Repair>({
      apiToCall: (data) => getRepairs(data.payload),
      extraPayload: { status: RepairStatus.InProgress },
      initialPageSize: 50,
      initialSortBy: "dueDate",
      initialSortDirection: SortDirection.Ascending,
    });

  const [repairsModalOpen, setRepairsModalOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [salesRevealed, setSalesRevealed] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const overdueCount =
    repairs?.filter((r) => getDueStatus(r.dueDate) === "overdue").length ?? 0;

  const openSalesReveal = () => {
    if (salesRevealed) return;
    setPinOpen(true);
  };

  const closePinOverlay = () => {
    setPinOpen(false);
  };

  const handleSalesPinSuccess = () => {
    setPinOpen(false);
    setSalesRevealed(true);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setSalesRevealed(false), 5000);
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
            to="/transactionHistory"
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
            value="$12,437.27"
            valueColor="var(--pos-green)"
            sub="6 transactions"
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
            value="$15,241"
            valueColor="var(--pos-green)"
            sub="+$3,059 today"
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
            value="212.5g"
            valueColor="var(--pos-gold)"
            sub="Avg 19.8K · $34,608 value"
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
        show={pinOpen}
        correctPin={SALES_PIN}
        title="View today's sales"
        onSuccess={handleSalesPinSuccess}
        onCancel={closePinOverlay}
      />
    </div>
  );
};

export default Home;
