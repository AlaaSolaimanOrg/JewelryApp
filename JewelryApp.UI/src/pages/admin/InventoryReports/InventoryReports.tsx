import { useState } from "react";
import { FaClipboardList, FaStore } from "react-icons/fa";
import HorizontalBarRow from "../../../components/HorizontalBarRow/HorizontalBarRow";
import MiniStatCard from "../../../components/MiniStatCard/MiniStatCard";
import ReportStatCard from "../../../components/ReportStatCard/ReportStatCard";
import CustomTable from "../../../components/tables/Table/CustomTable";
import type { TableHeader } from "../../../components/tables/Table/CustomTable";
import type { DateRange, Period } from "./InventoryReports.type";
import {
  AGING_BUCKETS,
  CATEGORY_STOCK,
  MOVEMENT_BY_PERIOD,
  MOVEMENT_BY_PURITY,
  PERIOD_LABELS,
  PURITY_STOCK,
  STAPLES,
  computeBarPercent,
} from "./InventoryReports.utils";
import "./inventoryReports.scss";

const PERIODS: Period[] = ["today", "week", "month", "year", "all"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const InventoryReports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    dateFrom: "2026-06-01",
    dateTo: "2026-06-11",
  });
  const [period, setPeriod] = useState<Period>("month");
  const [customScale, setCustomScale] = useState<number | null>(null);
  const [periodLabel, setPeriodLabel] = useState<string>(PERIOD_LABELS.month);
  const [isCustomRange, setIsCustomRange] = useState(false);

  const scaleInt = (n: number) =>
    customScale === null ? n : Math.round(n * customScale);
  const scaleFloat = (n: number) =>
    customScale === null ? n : Number((n * customScale).toFixed(1));

  const handleSetPeriod = (p: Period) => {
    setPeriod(p);
    setCustomScale(null);
    setPeriodLabel(PERIOD_LABELS[p]);
    setIsCustomRange(false);
  };

  const handleApplyCustomRange = () => {
    const { dateFrom, dateTo } = dateRange;
    if (!dateFrom || !dateTo) return;
    let fd = new Date(`${dateFrom}T12:00:00`);
    let td = new Date(`${dateTo}T12:00:00`);
    if (td < fd) [fd, td] = [td, fd];
    const days = Math.round((td.getTime() - fd.getTime()) / 86400000) + 1;
    setCustomScale(days / 30);
    setPeriod("month");
    setPeriodLabel(
      `${MONTH_LABELS[fd.getMonth()]} ${fd.getDate()} – ${MONTH_LABELS[td.getMonth()]} ${td.getDate()}, ${td.getFullYear()}`,
    );
    setIsCustomRange(true);
  };

  const maxPurityGrams = Math.max(...PURITY_STOCK.map((p) => p.grams));
  const totalCategoryValue = CATEGORY_STOCK.reduce((s, c) => s + c.value, 0);
  const maxCategoryValue = Math.max(...CATEGORY_STOCK.map((c) => c.value));

  const movement = MOVEMENT_BY_PERIOD[period];

  let totalStapleSold = 0;
  const stapleRows = STAPLES.map((s) => {
    const sold = scaleInt(s.soldByPeriod[period]);
    totalStapleSold += sold;
    const low = s.stock <= s.lowThreshold;
    return {
      name: <span className="stpl-name">{s.name}</span>,
      type: <span className="badge b-type">{s.type}</span>,
      stock: s.stock,
      sold: <span className="stpl-sold">{sold}</span>,
      status: (
        <span className={`badge ${low ? "b-low" : "b-ok"}`}>
          {low ? "LOW — reorder" : "OK"}
        </span>
      ),
    };
  });

  const stapleHeaders: TableHeader[] = [
    { key: "name", label: "Item" },
    { key: "type", label: "Type" },
    { key: "stock", label: "In stock", align: "right" },
    { key: "sold", label: `Sold (${periodLabel.toLowerCase()})`, align: "right" },
    { key: "status", label: "Stock status", align: "center" },
  ];

  const purityMovement = MOVEMENT_BY_PURITY[period];
  const maxAddedGrams = Math.max(...purityMovement.added.map((x) => x.grams)) || 1;
  const maxReturnedGrams =
    Math.max(...purityMovement.returned.map((x) => x.grams)) || 1;
  const totalAdded = purityMovement.added.reduce(
    (s, x) => s + scaleInt(x.items),
    0,
  );
  const totalReturned = purityMovement.returned.reduce(
    (s, x) => s + scaleInt(x.items),
    0,
  );

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
          value="4,837"
          sub="across 7 categories"
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Total weight"
          value="18,939g"
          sub="all purities"
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Stock value"
          value="$3,819,557"
          sub="at current sell prices"
          accentColor="var(--admin-green)"
          valueColor="var(--admin-green)"
        />
        <ReportStatCard
          label="Avg item age"
          value="64 days"
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
          {PURITY_STOCK.map((p) => (
            <HorizontalBarRow
              key={p.karat}
              label={p.karat}
              percent={computeBarPercent(p.grams, maxPurityGrams)}
              color="var(--admin-gold)"
              amountLabel={`${p.grams.toLocaleString()}g · $${Math.round(p.value).toLocaleString()} · ${p.items.toLocaleString()} items`}
            />
          ))}
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Stock by category</span>
            <span className="panel-sub">share of value</span>
          </div>
          {CATEGORY_STOCK.map((c) => (
            <HorizontalBarRow
              key={c.name}
              label={c.name}
              percent={computeBarPercent(c.value, maxCategoryValue)}
              color="var(--admin-blue)"
              amountLabel={`$${Math.round(c.value).toLocaleString()} · ${Math.round((c.value / totalCategoryValue) * 100)}%`}
            />
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Inventory aging</span>
          <span className="panel-sub">how long items have been sitting</span>
        </div>
        <div className="mini-grid4">
          {AGING_BUCKETS.map((b) => (
            <MiniStatCard
              key={b.label}
              label={b.label}
              value={b.count.toLocaleString()}
              sub={b.sub}
              valueColor={b.valueColor}
            />
          ))}
        </div>
      </div>

      <div className="sec-title move-title">Movement & bullion — filtered by period</div>
      <div className="period-bar">
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`pbtn ${!isCustomRange && period === p ? "active" : ""}`}
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
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
          />
          <span className="range-sep">to</span>
          <input
            type="date"
            className="date-input"
            value={dateRange.dateTo}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, dateTo: e.target.value }))
            }
          />
          <button className="apply-btn" onClick={handleApplyCustomRange}>
            Apply
          </button>
        </div>
      </div>

      <div className="stats4">
        <ReportStatCard
          label="Items added"
          value={scaleInt(movement.addedItems).toLocaleString()}
          sub={`${scaleFloat(movement.addedGrams).toLocaleString()}g · ${periodLabel}`}
          accentColor="var(--admin-green)"
          valueColor="var(--admin-green)"
        />
        <ReportStatCard
          label="Items sold"
          value={scaleInt(movement.soldItems).toLocaleString()}
          sub={`${scaleFloat(movement.soldGrams).toLocaleString()}g`}
          accentColor="var(--admin-gold)"
        />
        <ReportStatCard
          label="Items returned"
          value={scaleInt(movement.returnedItems).toLocaleString()}
          sub={`${scaleFloat(movement.returnedGrams).toLocaleString()}g back to stock`}
          accentColor="var(--admin-blue)"
          valueColor="var(--admin-blue)"
        />
        <ReportStatCard
          label="Melted"
          value={`${scaleFloat(movement.meltedGrams).toLocaleString()}g`}
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
          <span className="panel-sub">
            {totalStapleSold.toLocaleString()} staple items sold
          </span>
        </div>
        <CustomTable headers={stapleHeaders} data={stapleRows} />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Items added by purity</span>
            <span className="panel-sub">{totalAdded.toLocaleString()} items</span>
          </div>
          {purityMovement.added.map((x) => (
            <HorizontalBarRow
              key={x.karat}
              label={x.karat}
              percent={computeBarPercent(x.grams, maxAddedGrams)}
              color="var(--admin-green)"
              amountLabel={`${scaleInt(x.items).toLocaleString()} items · ${scaleFloat(x.grams).toLocaleString()}g`}
            />
          ))}
        </div>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Items returned by purity</span>
            <span className="panel-sub">{totalReturned.toLocaleString()} items</span>
          </div>
          {purityMovement.returned.map((x) => (
            <HorizontalBarRow
              key={x.karat}
              label={x.karat}
              percent={computeBarPercent(x.grams, maxReturnedGrams)}
              color="var(--admin-amber)"
              amountLabel={`${scaleInt(x.items).toLocaleString()} items · ${scaleFloat(x.grams).toLocaleString()}g`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;
