import { useState } from "react";
import { FaBoxOpen, FaFire, FaHistory, FaSearch } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import AdminStatCard from "../../../components/cards/AdminStatCard/AdminStatCard";
import GoldPoolCard from "../../../components/cards/GoldPoolCard/GoldPoolCard";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import type { TableHeader } from "../../../components/tables/CustomTable/CustomTable";
import {
  getUsedGoldPools,
  getUsedGoldPeriodStats,
  getUsedGoldHistory,
  sendToMelt,
  returnToStock,
} from "../../../apis/usedGold.api";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { checkRequestSucceeded, getYearsSince, handleSort, showError, showSuccess } from "../../../utils";
import { SortDirection } from "../../../types/enums";
import MeltGoldModal from "./MeltGoldModal/MeltGoldModal";
import ReturnToStockModal from "./ReturnToStockModal/ReturnToStockModal";
import type { ReturnToStockPayload } from "./ReturnToStockModal/ReturnToStockModal.type";
import type {
  GoldPool,
  PeriodStats,
  UsedGoldHistoryEntry,
} from "./UsedGold.type";
import { Period } from "./UsedGold.type";
import {
  MONTHS,
  STANDARD_KARATS,
  fmtCurrency,
  fmtCurrencyRounded,
  fmtDate,
  fmtWeight,
  getAllKarats,
  getAvgPurity,
  getCurrentValue,
  getKaratColor,
  getTotalInvested,
  getTotalOnHand,
} from "./UsedGold.utils";
import "./usedGold.scss";

const YEARS = getYearsSince(2025);

const EMPTY_POOL: GoldPool = { weight: 0, cost: 0, totalInvested: 0 };

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: Period.Today, label: "Today" },
  { value: Period.Week, label: "This week" },
  { value: Period.Month, label: "Month" },
  { value: Period.Year, label: "Year" },
  { value: Period.All, label: "All time" },
];

const TYPE_LABEL:Record<UsedGoldHistoryEntry["type"], string> = {
  purchase: "Purchases",
  melt: "Melts",
  stock: "Returned to stock",
};

const UsedGold = () => {
  const now = new Date();

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const [period, setPeriod] = useState<Period>(Period.Today);
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());

  const { data: currentPools } = useLocalApi({
    apiToCall: () => getUsedGoldPools(),
    dataInitalValue: {},
    effectDependency: [refreshKey],
  }) as { data: Record<number, GoldPool> };

  const { data: periodStats } = useLocalApi({
    apiToCall: (data) => getUsedGoldPeriodStats(data.payload),
    payload: { period, month: selMonth, year: selYear },
    dataInitalValue: {
      purchaseCount: 0,
      spent: 0,
      spentCash: 0,
      spentCard: 0,
      boughtWeight: 0,
      meltedWeight: 0,
      returnedWeight: 0,
    } as PeriodStats,
    effectDependency: [refreshKey, period, selMonth, selYear],
  }) as { data: PeriodStats };

  const [typeFilter, setTypeFilter] = useState<
    "all" | UsedGoldHistoryEntry["type"]
  >("all");

  const [showMeltModal, setShowMeltModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const totalOnHand = getTotalOnHand(currentPools);
  const currentValue = getCurrentValue(currentPools);
  const totalInvested = getTotalInvested(currentPools);
  const avgPurity = getAvgPurity(currentPools);
  const netWeightChange =
    periodStats.boughtWeight - periodStats.meltedWeight - periodStats.returnedWeight;

  const periodLabel = {
    [Period.Today]: "Today",
    [Period.Week]: "This week",
    [Period.Month]: `${MONTHS[selMonth]} ${selYear}`,
    [Period.Year]: `${selYear}`,
    [Period.All]: "All time",
  }[period];

  const {
    data: history,
    isLoading: isLoadingHistory,
    onSearchChange,
    onSortChange,
    onPaginationChange,
    onPageSizeChange,
    sortCriteria,
    pagination,
  } = useLocalApiSearchSortPagination<UsedGoldHistoryEntry>({
    apiToCall: (data) => getUsedGoldHistory(data.payload),
    extraPayload: {
      typeFilter: typeFilter === "all" ? undefined : typeFilter,
      period,
      month: selMonth,
      year: selYear,
    },
    extraEffectDependency: [refreshKey, typeFilter, period, selMonth, selYear],
    initialPageSize: 10,
    initialSortBy: "date",
    initialSortDirection: SortDirection.Descending,
  });

  const handlePeriodFilterChange = (value: Period) => {
    setPeriod(value);
    onPaginationChange(1);
  };

  const handleTypeFilterChange = (value: "all" | UsedGoldHistoryEntry["type"]) => {
    setTypeFilter(value);
    onPaginationChange(1);
  };

  const otherKarats = getAllKarats(currentPools).filter(
    (k) => !STANDARD_KARATS.includes(k),
  );

  const renderSortArrow = (field: string) =>
    sortCriteria.sortBy === field && (
      <span className="sort-arrow">
        {sortCriteria.sortDirection === SortDirection.Ascending ? "▲" : "▼"}
      </span>
    );

  const logHeaders: TableHeader[] = [
    {
      key: "date",
      label: <>Date {renderSortArrow("date")}</>,
      width: "90px",
      onHeaderClick: () => handleSort("date", sortCriteria, onSortChange),
    },
    { key: "sellerName", label: "Name" },
    {
      key: "karat",
      label: <>Karat {renderSortArrow("karat")}</>,
      width: "70px",
      align: "center",
      onHeaderClick: () => handleSort("karat", sortCriteria, onSortChange),
    },
    {
      key: "weight",
      label: <>Weight {renderSortArrow("weight")}</>,
      width: "70px",
      align: "center",
      onHeaderClick: () => handleSort("weight", sortCriteria, onSortChange),
    },
    {
      key: "cost",
      label: <>Cost {renderSortArrow("cost")}</>,
      width: "100px",
      align: "right",
      onHeaderClick: () => handleSort("cost", sortCriteria, onSortChange),
    },
    {
      key: "type",
      label: <>Type {renderSortArrow("type")}</>,
      width: "90px",
      align: "center",
      onHeaderClick: () => handleSort("type", sortCriteria, onSortChange),
    },
  ];

  const logData = (history || []).map((h) => ({
    date: <span className="lr-date">{fmtDate(h.date)}</span>,
    sellerName: (
      <div>
        <div className="lr-desc">{h.sellerName}</div>
        <div className="lr-sub">{h.notes}</div>
      </div>
    ),
    karat: h.karat == null ? "Mixed" : `${h.karat}K`,
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
    type: (
      <span className={`lr-badge badge-${h.type}`}>{h.type.toUpperCase()}</span>
    ),
  }));

  const poolCard = (k: number) => {
    const pool = currentPools[k] ?? EMPTY_POOL;
    return (
      <GoldPoolCard
        key={k}
        karat={k}
        weightGrams={pool.weight}
        valueAmount={pool.cost}
        accentColor={getKaratColor(k)}
      />
    );
  };

  const handleMeltConfirm = async (
    items: { karat: number; weight: number }[],
    notes: string,
  ) => {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    const response = await sendToMelt({ items, notes: notes || undefined });
    if (checkRequestSucceeded(response?.statusCode)) {
      setShowMeltModal(false);
      showSuccess(
        response?.message || `Sent ${totalWeight.toFixed(2)}g to melt`,
      );
      refresh();
    } else {
      showError(response?.message || "Failed to record melt batch");
    }
  };

  const handleStockConfirm = async (payload: ReturnToStockPayload) => {
    const { karat, weight } = payload;
    const response = await returnToStock(payload);
    if (checkRequestSucceeded(response?.statusCode)) {
      setShowStockModal(false);
      showSuccess(response?.message || `${weight.toFixed(2)}g ${karat}K returned to stock`);
      refresh();
    } else {
      showError(response?.message || "Failed to return gold to stock");
    }
  };

  return (
    <div id="used-gold" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <GiGoldBar className="icon" />
          <span>Used gold</span>
        </h1>
        <div className="page-actions">
          <button
            className="btn-md btn-green"
            onClick={() =>
              totalOnHand > 0 ? setShowStockModal(true) : undefined
            }
            disabled={totalOnHand <= 0}
          >
            <FaBoxOpen /> Return to stock
          </button>
          <button
            className="btn-md btn-amber"
            onClick={() =>
              totalOnHand > 0 ? setShowMeltModal(true) : undefined
            }
            disabled={totalOnHand <= 0}
          >
            <FaFire /> Send to melt
          </button>
        </div>
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
      </div>

      <div className="section-title">Gold pools — what's in the drawer</div>
      <div className="pools">{STANDARD_KARATS.map((k) => poolCard(k))}</div>

      {otherKarats.length > 0 && (
        <>
          <div className="section-title">
            Other purities — odd buys (9K, 23K, ...)
          </div>
          <div className="pools">{otherKarats.map((k) => poolCard(k))}</div>
        </>
      )}

      <div className="section-title">History ({periodLabel})</div>
      <div className="controls">
        <div className="ctrl-group">
          <span className="ctrl-label">Period:</span>
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              className={`pbtn ${period === p.value ? "active" : ""}`}
              onClick={() => handlePeriodFilterChange(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {(period === Period.Month || period === Period.Year) && (
          <div className="ctrl-group">
            {period === Period.Month && (
              <select
                className="ctrl-select"
                value={selMonth}
                onChange={(e) => {
                  setSelMonth(Number(e.target.value));
                  onPaginationChange(1);
                }}
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
              onChange={(e) => {
                setSelYear(Number(e.target.value));
                onPaginationChange(1);
              }}
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
          value={fmtCurrencyRounded(periodStats.spent)}
          label={`Spent (${periodLabel})`}
          valueColor="var(--admin-blue)"
        />
        <AdminStatCard
          value={fmtCurrencyRounded(periodStats.spentCash)}
          label={`Paid in cash (${periodLabel})`}
          valueColor="var(--admin-green)"
        />
        <AdminStatCard
          value={fmtCurrencyRounded(periodStats.spentCard)}
          label={`Paid by card (${periodLabel})`}
          valueColor="var(--admin-purple)"
        />
        <AdminStatCard
          value={`${periodStats.purchaseCount}`}
          label={`Purchases (${periodLabel})`}
        />
      </div>

      <div className="stats">
        <AdminStatCard
          value={fmtWeight(periodStats.boughtWeight)}
          label={`Gold bought (${periodLabel})`}
          valueColor="var(--admin-gold)"
        />
        <AdminStatCard
          value={fmtWeight(periodStats.meltedWeight)}
          label={`Melted (${periodLabel})`}
          valueColor="var(--admin-amber)"
        />
        <AdminStatCard
          value={fmtWeight(periodStats.returnedWeight)}
          label={`Returned to stock (${periodLabel})`}
          valueColor="var(--admin-green)"
        />
        <AdminStatCard
          value={`${netWeightChange > 0 ? "+" : netWeightChange < 0 ? "-" : ""}${fmtWeight(Math.abs(netWeightChange))}`}
          label={`Net change (${periodLabel})`}
          valueColor="var(--admin-blue)"
        />
      </div>

      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            <FaHistory className="icon" /> {pagination.totalRecords}{" "}
            {pagination.totalRecords === 1 ? "entry" : "entries"}
          </span>
          <div className="tbl-tools">
            <div className="search-wrap">
              <FaSearch className="search-ico" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                autoComplete="off"
                onChange={onSearchChange}
              />
            </div>
            <select
              className="log-filter"
              value={typeFilter}
              onChange={(e) =>
                handleTypeFilterChange(
                  e.target.value as "all" | UsedGoldHistoryEntry["type"],
                )
              }
            >
              <option value="all">All</option>
              <option value="purchase">{TYPE_LABEL.purchase}</option>
              <option value="melt">{TYPE_LABEL.melt}</option>
              <option value="stock">{TYPE_LABEL.stock}</option>
            </select>
          </div>
        </div>
        <CustomTable headers={logHeaders} data={logData} isLoading={isLoadingHistory} />
        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
          maxPages={4}
        />
      </div>

      <MeltGoldModal
        show={showMeltModal}
        onClose={() => setShowMeltModal(false)}
        pools={currentPools}
        onConfirm={handleMeltConfirm}
      />
      <ReturnToStockModal
        show={showStockModal}
        onClose={() => setShowStockModal(false)}
        pools={currentPools}
        onConfirm={handleStockConfirm}
      />
    </div>
  );
};

export default UsedGold;
