import { useMemo, useState } from "react";
import { FaBoxOpen, FaFire, FaHistory, FaSearch } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import AdminStatCard from "../../../components/AdminStatCard/AdminStatCard";
import GoldPoolCard from "../../../components/GoldPoolCard/GoldPoolCard";
import CustomTable from "../../../components/tables/Table/CustomTable";
import type { TableHeader } from "../../../components/tables/Table/CustomTable";
import { showSuccess } from "../../../utils";
import MeltGoldModal from "./MeltGoldModal/MeltGoldModal";
import ReturnToStockModal from "./ReturnToStockModal/ReturnToStockModal";
import type { GoldPool, Period, UsedGoldHistoryEntry } from "./UsedGold.type";
import {
  MONTHS,
  STANDARD_KARATS,
  createMockHistory,
  createMockPools,
  filterHistoryByPeriod,
  fmtCurrency,
  fmtCurrencyRounded,
  fmtDate,
  getAllKarats,
  getAvgPurity,
  getCurrentValue,
  getKaratColor,
  getTotalInvested,
  getTotalOnHand,
} from "./UsedGold.utils";
import "./usedGold.scss";

const YEARS = [2026, 2025];

const TYPE_LABEL: Record<UsedGoldHistoryEntry["type"], string> = {
  purchase: "Purchases",
  melt: "Melts",
  stock: "Returned to stock",
};

const UsedGold = () => {
  const now = new Date();

  const [pools, setPools] = useState<Record<number, GoldPool>>(createMockPools());
  const [history, setHistory] = useState<UsedGoldHistoryEntry[]>(createMockHistory());
  const [nextHistId, setNextHistId] = useState(1000);

  const [period, setPeriod] = useState<Period>("month");
  const [selMonth, setSelMonth] = useState(5);
  const [selYear, setSelYear] = useState(2026);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | UsedGoldHistoryEntry["type"]>("all");

  const [showMeltModal, setShowMeltModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const totalOnHand = getTotalOnHand(pools);
  const currentValue = getCurrentValue(pools);
  const totalInvested = getTotalInvested(pools);
  const avgPurity = getAvgPurity(pools);

  const periodLabel =
    period === "month" ? `${MONTHS[selMonth]} ${selYear}` : period === "year" ? `${selYear}` : "All time";

  const filteredHistory = useMemo(
    () => filterHistoryByPeriod(history, period, selMonth, selYear),
    [history, period, selMonth, selYear],
  );

  const periodPurchases = filteredHistory.filter((h) => h.type === "purchase");
  const periodSpent = periodPurchases.reduce((sum, h) => sum + h.cost, 0);

  const logRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = filteredHistory;
    if (typeFilter !== "all") rows = rows.filter((h) => h.type === typeFilter);
    if (q) {
      rows = rows.filter(
        (h) => h.desc.toLowerCase().includes(q) || h.notes.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [filteredHistory, typeFilter, search]);

  const otherKarats = getAllKarats(pools).filter((k) => !STANDARD_KARATS.includes(k));

  const logHeaders: TableHeader[] = [
    { key: "date", label: "Date", width: "90px" },
    { key: "desc", label: "Description" },
    { key: "karat", label: "Karat", width: "70px", align: "center" },
    { key: "weight", label: "Weight", width: "70px", align: "center" },
    { key: "cost", label: "Cost", width: "100px", align: "right" },
    { key: "type", label: "Type", width: "90px", align: "center" },
  ];

  const logData = logRows.map((h) => ({
    date: <span className="lr-date">{fmtDate(h.date)}</span>,
    desc: (
      <div>
        <div className="lr-desc">{h.desc}</div>
        <div className="lr-sub">{h.notes}</div>
      </div>
    ),
    karat: h.karat === "mixed" ? "Mixed" : `${h.karat}K`,
    weight: `${h.weight.toFixed(1)}g`,
    cost: (
      <span
        className="lr-cost"
        style={{
          color:
            h.type === "purchase"
              ? "var(--admin-red)"
              : h.type === "melt"
                ? "var(--admin-amber)"
                : "var(--admin-green)",
        }}
      >
        {fmtCurrency(h.cost)}
      </span>
    ),
    type: <span className={`lr-badge badge-${h.type}`}>{h.type.toUpperCase()}</span>,
  }));

  const poolCard = (k: number) => (
    <GoldPoolCard
      key={k}
      karat={k}
      weightGrams={pools[k].weight}
      valueAmount={pools[k].cost}
      accentColor={getKaratColor(k)}
    />
  );

  const handleMeltConfirm = (bagWeight: number, notes: string) => {
    const total = getTotalOnHand(pools);
    const ratio = Math.min(bagWeight / total, 1);

    let totalCostRemoved = 0;
    const nextPools: Record<number, GoldPool> = {};
    getAllKarats(pools).forEach((k) => {
      const p = pools[k];
      if (p.weight <= 0) {
        nextPools[k] = p;
        return;
      }
      const removeCost = p.cost * ratio;
      totalCostRemoved += removeCost;
      nextPools[k] = {
        ...p,
        weight: Math.max(0, p.weight - p.weight * ratio),
        cost: Math.max(0, p.cost - removeCost),
      };
    });

    setPools(nextPools);
    setHistory((prev) => [
      {
        id: nextHistId,
        date: now.toISOString().slice(0, 10),
        type: "melt",
        desc: "Melt batch",
        notes: notes || "Mixed bag sent to dealer",
        karat: "mixed",
        weight: bagWeight,
        cost: totalCostRemoved,
      },
      ...prev,
    ]);
    setNextHistId((id) => id + 1);
    setShowMeltModal(false);
    showSuccess(`Sent ${bagWeight.toFixed(2)}g to melt — ${fmtCurrencyRounded(totalCostRemoved)} value`);
  };

  const handleStockConfirm = (karat: number, weight: number, notes: string) => {
    const p = pools[karat];
    const avg = p.cost / p.weight;
    const costRemoved = avg * weight;

    setPools((prev) => ({
      ...prev,
      [karat]: {
        ...prev[karat],
        weight: Math.max(0, prev[karat].weight - weight),
        cost: Math.max(0, prev[karat].cost - costRemoved),
      },
    }));
    setHistory((prev) => [
      {
        id: nextHistId,
        date: now.toISOString().slice(0, 10),
        type: "stock",
        desc: "Return to stock",
        notes: notes || `${karat}K returned to display`,
        karat,
        weight,
        cost: costRemoved,
      },
      ...prev,
    ]);
    setNextHistId((id) => id + 1);
    setShowStockModal(false);
    showSuccess(`${weight.toFixed(2)}g ${karat}K returned to stock`);
  };

  return (
    <div id="used-gold" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <GiGoldBar className="icon" />
          <span>Used gold</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-green" onClick={() => setShowStockModal(true)}>
            <FaBoxOpen /> Return to stock
          </button>
          <button
            className="btn-md btn-amber"
            onClick={() => (totalOnHand > 0 ? setShowMeltModal(true) : undefined)}
            disabled={totalOnHand <= 0}
          >
            <FaFire /> Send to melt
          </button>
        </div>
      </div>

      <div className="controls">
        <div className="ctrl-group">
          <span className="ctrl-label">Period:</span>
          <button
            className={`pbtn ${period === "month" ? "active" : ""}`}
            onClick={() => setPeriod("month")}
          >
            Month
          </button>
          <button
            className={`pbtn ${period === "year" ? "active" : ""}`}
            onClick={() => setPeriod("year")}
          >
            Year
          </button>
          <button
            className={`pbtn ${period === "all" ? "active" : ""}`}
            onClick={() => setPeriod("all")}
          >
            All time
          </button>
        </div>
        {period !== "all" && (
          <div className="ctrl-group">
            {period === "month" && (
              <select
                className="ctrl-select"
                value={selMonth}
                onChange={(e) => setSelMonth(Number(e.target.value))}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            )}
            <select
              className="ctrl-select"
              value={selYear}
              onChange={(e) => setSelYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="stats">
        <AdminStatCard
          value={`${totalOnHand.toFixed(1)}g`}
          label="On hand"
          valueColor="var(--admin-gold)"
        />
        <AdminStatCard
          value={`${avgPurity.toFixed(1)}K`}
          label="Avg purity"
          valueColor="var(--admin-amber)"
        />
        <AdminStatCard
          value={fmtCurrencyRounded(currentValue)}
          label="Value on hand"
          valueColor="var(--admin-green)"
        />
        <AdminStatCard
          value={fmtCurrencyRounded(totalInvested)}
          label="Total invested"
          valueColor="var(--admin-red)"
        />
        <AdminStatCard
          value={fmtCurrencyRounded(periodSpent)}
          label={`Spent (${periodLabel})`}
          valueColor="var(--admin-blue)"
        />
        <AdminStatCard
          value={`${periodPurchases.length}`}
          label={`Purchases (${periodLabel})`}
        />
      </div>

      <div className="section-title">Gold pools — what's in the drawer</div>
      <div className="pools">{STANDARD_KARATS.map((k) => poolCard(k))}</div>

      {otherKarats.length > 0 && (
        <>
          <div className="section-title">Other purities — odd buys (9K, 23K, ...)</div>
          <div className="pools">{otherKarats.map((k) => poolCard(k))}</div>
        </>
      )}

      <div className="section-title">History</div>
      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            <FaHistory className="icon" /> {logRows.length}{" "}
            {logRows.length === 1 ? "entry" : "entries"}
          </span>
          <div className="tbl-tools">
            <div className="search-wrap">
              <FaSearch className="search-ico" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="log-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | UsedGoldHistoryEntry["type"])}
            >
              <option value="all">All</option>
              <option value="purchase">{TYPE_LABEL.purchase}</option>
              <option value="melt">{TYPE_LABEL.melt}</option>
              <option value="stock">{TYPE_LABEL.stock}</option>
            </select>
          </div>
        </div>
        <CustomTable headers={logHeaders} data={logData} />
      </div>

      <MeltGoldModal
        show={showMeltModal}
        onClose={() => setShowMeltModal(false)}
        pools={pools}
        onConfirm={handleMeltConfirm}
      />
      <ReturnToStockModal
        show={showStockModal}
        onClose={() => setShowStockModal(false)}
        pools={pools}
        onConfirm={handleStockConfirm}
      />
    </div>
  );
};

export default UsedGold;
