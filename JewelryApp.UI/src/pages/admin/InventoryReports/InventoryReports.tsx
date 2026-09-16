import { useState } from "react";
import { FaClipboardList, FaStore } from "react-icons/fa";
import {
  getInventoryAging,
  getInventoryMovement,
  getInventoryStockSummary,
  getMovementByPurity,
  getStaplesSold,
  getStockByCategory,
  getStockByPurity,
} from "../../../apis/inventoryReports.api";
import HorizontalBarRow from "../../../components/charts/HorizontalBarRow/HorizontalBarRow";
import MiniStatCard from "../../../components/cards/MiniStatCard/MiniStatCard";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import type { TableHeader } from "../../../components/tables/CustomTable/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import type {
  DateRange,
  InventoryAging,
  InventoryMovement,
  InventoryStockSummary,
  Period,
  PurityMovement,
  StapleSold,
  StockByCategoryRow,
  StockByPurityRow,
} from "./InventoryReports.type";
import {
  PERIOD_LABELS,
  computeBarPercent,
  fmtCurrency,
  fmtNumber,
  formatRangeLabel,
  getCustomRange,
  getPeriodRange,
} from "./InventoryReports.utils";
import "./inventoryReports.scss";

const PERIODS: Exclude<Period, "custom">[] = ["today", "week", "month", "year", "all"];

const AGING_COLORS: Record<string, string | undefined> = {
  "0-30 days": "var(--admin-green)",
  "61-90 days": "var(--admin-amber)",
  "90+ days": "var(--admin-red)",
};

const InventoryReports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    dateFrom: "2026-06-01",
    dateTo: "2026-06-11",
  });
  const [period, setPeriod] = useState<Period>("month");
  const [appliedRange, setAppliedRange] = useState<{ dateFrom: string; dateTo: string } | null>(null);

  const handleSetPeriod = (p: Exclude<Period, "custom">) => {
    setPeriod(p);
    setAppliedRange(null);
  };

  const handleApplyCustomRange = () => {
    const { dateFrom, dateTo } = dateRange;
    if (!dateFrom || !dateTo) return;
    setAppliedRange({ dateFrom, dateTo });
    setPeriod("custom");
  };

  const activeRange =
    period === "custom" && appliedRange
      ? getCustomRange(appliedRange.dateFrom, appliedRange.dateTo)
      : getPeriodRange(period as Exclude<Period, "custom">);

  const periodLabel =
    period === "custom" && appliedRange
      ? formatRangeLabel(appliedRange.dateFrom, appliedRange.dateTo)
      : PERIOD_LABELS[period];

  /* ── Stock right now (not period-filtered) ───────────────────── */

  const { data: stockSummary } = useLocalApi({
    apiToCall: () => getInventoryStockSummary(),
    dataInitalValue: {},
  }) as { data: Partial<InventoryStockSummary> };

  const { data: stockByPurity } = useLocalApi({
    apiToCall: () => getStockByPurity(),
  }) as { data: StockByPurityRow[] };

  const { data: stockByCategory } = useLocalApi({
    apiToCall: () => getStockByCategory(),
  }) as { data: StockByCategoryRow[] };

  const { data: inventoryAging } = useLocalApi({
    apiToCall: () => getInventoryAging(),
    dataInitalValue: {},
  }) as { data: Partial<InventoryAging> };

  /* ── Movement & bullion (period-filtered) ────────────────────── */

  const { data: movement } = useLocalApi({
    apiToCall: (data) => getInventoryMovement(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo },
    dataInitalValue: {},
    effectDependency: [period, appliedRange],
  }) as { data: Partial<InventoryMovement> };

  const { data: purityMovement } = useLocalApi({
    apiToCall: (data) => getMovementByPurity(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo },
    dataInitalValue: { added: [], returned: [] },
    effectDependency: [period, appliedRange],
  }) as { data: PurityMovement };

  const { data: staplesSold } = useLocalApi({
    apiToCall: (data) => getStaplesSold(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo },
    effectDependency: [period, appliedRange],
  }) as { data: StapleSold[] };

  const maxPurityGrams = Math.max(...stockByPurity.map((p) => p.grams), 1);
  const totalCategoryValue = stockByCategory.reduce((s, c) => s + c.value, 0);
  const maxCategoryValue = Math.max(...stockByCategory.map((c) => c.value), 1);

  const agingBuckets = inventoryAging.agingBuckets ?? [];

  const totalStapleSold = staplesSold.reduce((sum, s) => sum + s.sold, 0);
  const stapleRows = staplesSold.map((s) => ({
    name: <span className="stpl-name">{s.name}</span>,
    type: <span className="badge b-type">{s.specification ?? "—"}</span>,
    stock: s.stock,
    sold: <span className="stpl-sold">{s.sold}</span>,
    status: (
      <span className={`badge ${s.isLow ? "b-low" : "b-ok"}`}>
        {s.isLow ? "LOW — reorder" : "OK"}
      </span>
    ),
  }));

  const stapleHeaders: TableHeader[] = [
    { key: "name", label: "Item" },
    { key: "type", label: "Type" },
    { key: "stock", label: "In stock", align: "right" },
    { key: "sold", label: `Sold (${periodLabel.toLowerCase()})`, align: "right" },
    { key: "status", label: "Stock status", align: "center" },
  ];

  const addedByPurity = purityMovement.added;
  const returnedByPurity = purityMovement.returned;
  const maxAddedGrams = Math.max(...addedByPurity.map((x) => x.grams), 1);
  const maxReturnedGrams = Math.max(...returnedByPurity.map((x) => x.grams), 1);
  const totalAdded = addedByPurity.reduce((s, x) => s + x.items, 0);
  const totalReturned = returnedByPurity.reduce((s, x) => s + x.items, 0);

  return (
    <div id="inventory-reports" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaClipboardList className="icon" />
          <span>Inventory Reports</span>
        </h1>
      </div>

      <div className="sec-title">Stock right now</div>
      <div className="stats4">
        <ReportStatCard
          label="Items in stock"
          value={fmtNumber(stockSummary.itemsInStock ?? 0)}
          sub={`across ${stockSummary.categoriesCount ?? 0} categories`}
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Total weight"
          value={`${fmtNumber(stockSummary.totalWeight ?? 0)}g`}
          sub="all purities"
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Stock value"
          value={fmtCurrency(stockSummary.stockValue ?? 0)}
          sub="at current sell prices"
          accentColor="var(--admin-green)"
          valueColor="var(--admin-green)"
        />
        <ReportStatCard
          label="Avg item age"
          value={`${Math.round(inventoryAging.averageDaysInInventory ?? 0)} days`}
          sub="since added to stock"
          accentColor="var(--admin-blue)"
        />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Stock by purity</span>
            <span className="panel-sub">weight · value · items</span>
          </div>
          {stockByPurity.length > 0 ? (
            stockByPurity.map((p) => (
              <HorizontalBarRow
                key={p.karatType}
                label={`${p.karatType}K`}
                percent={computeBarPercent(p.grams, maxPurityGrams)}
                color="var(--admin-gold)"
                amountLabel={`${fmtNumber(p.grams)}g · ${fmtCurrency(p.value)} · ${fmtNumber(p.items)} items`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Stock by category</span>
            <span className="panel-sub">share of value</span>
          </div>
          {stockByCategory.length > 0 ? (
            stockByCategory.map((c) => (
              <HorizontalBarRow
                key={c.categoryName}
                label={c.categoryName}
                percent={computeBarPercent(c.value, maxCategoryValue)}
                color="var(--admin-blue)"
                amountLabel={`${fmtCurrency(c.value)} · ${totalCategoryValue > 0 ? Math.round((c.value / totalCategoryValue) * 100) : 0}%`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Inventory aging</span>
          <span className="panel-sub">how long items have been sitting</span>
        </div>
        <div className="mini-grid4">
          {agingBuckets.length > 0 ? (
            agingBuckets.map((b) => (
              <MiniStatCard
                key={b.label}
                label={b.label}
                value={fmtNumber(b.itemCount)}
                sub={`${fmtCurrency(b.totalEstimatedValue)} · ${b.percentage}%`}
                valueColor={AGING_COLORS[b.label]}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>

      <div className="sec-title move-title">
        Movement &amp; bullion — filtered by period
      </div>
      <div className="period-bar">
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`pbtn ${period === p ? "active" : ""}`}
            onClick={() => handleSetPeriod(p)}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
        <div className="range-inputs">
          <input
            type="date"
            className="date-input"
            value={dateRange.dateFrom}
            onChange={(e) => setDateRange((prev) => ({ ...prev, dateFrom: e.target.value }))}
          />
          <span className="range-sep">to</span>
          <input
            type="date"
            className="date-input"
            value={dateRange.dateTo}
            onChange={(e) => setDateRange((prev) => ({ ...prev, dateTo: e.target.value }))}
          />
          <button className="apply-btn" onClick={handleApplyCustomRange}>
            Apply
          </button>
        </div>
      </div>

      <div className="stats4">
        <ReportStatCard
          label="Items added"
          value={fmtNumber(movement.addedItems ?? 0)}
          sub={`${fmtNumber(movement.addedGrams ?? 0)}g · ${periodLabel}`}
          accentColor="var(--admin-green)"
          valueColor="var(--admin-green)"
        />
        <ReportStatCard
          label="Items sold"
          value={fmtNumber(movement.soldItems ?? 0)}
          sub={`${fmtNumber(movement.soldGrams ?? 0)}g`}
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Items returned"
          value={fmtNumber(movement.returnedItems ?? 0)}
          sub={`${fmtNumber(movement.returnedGrams ?? 0)}g back to stock`}
          accentColor="var(--admin-blue)"
          valueColor="var(--admin-blue)"
        />
        <ReportStatCard
          label="Melted"
          value={`${fmtNumber(movement.meltedGrams ?? 0)}g`}
          sub="sent to dealer"
          accentColor="var(--admin-amber)"
          valueColor="var(--admin-amber)"
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <FaStore className="icon" /> Bullion &amp; staples sold
          </span>
          <span className="panel-sub">{fmtNumber(totalStapleSold)} staple items sold</span>
        </div>
        {stapleRows.length > 0 ? (
          <CustomTable headers={stapleHeaders} data={stapleRows} />
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Items added by purity</span>
            <span className="panel-sub">{fmtNumber(totalAdded)} items</span>
          </div>
          {addedByPurity.length > 0 ? (
            addedByPurity.map((x) => (
              <HorizontalBarRow
                key={x.karatType}
                label={`${x.karatType}K`}
                percent={computeBarPercent(x.grams, maxAddedGrams)}
                color="var(--admin-green)"
                amountLabel={`${fmtNumber(x.items)} items · ${fmtNumber(x.grams)}g`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Items returned by purity</span>
            <span className="panel-sub">{fmtNumber(totalReturned)} items</span>
          </div>
          {returnedByPurity.length > 0 ? (
            returnedByPurity.map((x) => (
              <HorizontalBarRow
                key={x.karatType}
                label={`${x.karatType}K`}
                percent={computeBarPercent(x.grams, maxReturnedGrams)}
                color="var(--admin-amber)"
                amountLabel={`${fmtNumber(x.items)} items · ${fmtNumber(x.grams)}g`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;
