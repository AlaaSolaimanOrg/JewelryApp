import { useState } from "react";
import { FaChartBar, FaExpand } from "react-icons/fa";
import { getSalesByCategory, getSalesOverTime } from "../../../apis/analytics.api/analytics.api";
import { getSalesInsights } from "../../../apis/sales.api/sales.api";
import ReportListPanel from "../../../components/ReportListPanel/ReportListPanel";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import HorizontalBarRow from "../../../components/charts/HorizontalBarRow/HorizontalBarRow";
import RevenueBarChart from "../../../components/charts/RevenueBarChart/RevenueBarChart";
import ChartExpandModal from "../../../components/modals/ChartExpandModal/ChartExpandModal";
import useLocalApi from "../../../hooks/useLocalApi";
import ItemsSoldTo from "./itemsSoldTo/ItemsSoldTo";
import type { Period } from "./SalesReports.type";
import {
  MOCK_STATIC,
  PERIODS,
  PERIOD_LABELS,
  computePercent,
  fmtCurrency,
  fmtNumber,
  formatRangeLabel,
  getCustomRange,
  getPeriodRange,
  getReportType,
  scaleStaticForCustomRange,
} from "./SalesReports.utils";
import "./salesReports.scss";

interface GoldByKarat {
  karatType: number;
  weight: number;
  pricePerGram: number;
  totalValue: number;
}

interface SalesInsights {
  totalSalesAmount: number;
  cashAmountPaid: number;
  cardAmountPaid: number;
  discountAmount: number;
  goldByKarat: GoldByKarat[];
}

interface SalesOverTimeItem {
  dateLabel: string;
  revenue: number;
}

interface SalesByCategoryItem {
  categoryName: string;
  revenue: number;
  percentage: number;
}

type ExpandedChart = "revenue" | "units" | "category" | null;

const SalesReports = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-11");
  const [appliedRange, setAppliedRange] = useState<{ dateFrom: string; dateTo: string } | null>(null);
  const [expandedChart, setExpandedChart] = useState<ExpandedChart>(null);

  const handleSetPeriod = (p: Exclude<Period, "custom">) => {
    setPeriod(p);
    setAppliedRange(null);
  };

  const handleApplyRange = () => {
    if (!dateFrom || !dateTo) return;
    setAppliedRange({ dateFrom, dateTo });
    setPeriod("custom");
  };

  const activeRange =
    period === "custom" && appliedRange
      ? getCustomRange(appliedRange.dateFrom, appliedRange.dateTo)
      : getPeriodRange(period as Exclude<Period, "custom">);

  const reportType = getReportType(period);

  const periodLabel =
    period === "custom" && appliedRange
      ? formatRangeLabel(appliedRange.dateFrom, appliedRange.dateTo)
      : PERIOD_LABELS[period];

  const staticStats =
    period === "custom" && appliedRange
      ? scaleStaticForCustomRange(appliedRange.dateFrom, appliedRange.dateTo)
      : MOCK_STATIC[period as Exclude<Period, "custom">];

  const { data: salesInsights } = useLocalApi({
    apiToCall: (data) => getSalesInsights(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo },
    dataInitalValue: {},
    effectDependency: [period, appliedRange],
  }) as { data: Partial<SalesInsights> };

  const { data: salesOverTime } = useLocalApi({
    apiToCall: (data) => getSalesOverTime(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo, reportType },
    effectDependency: [period, appliedRange],
  }) as { data: SalesOverTimeItem[] };

  const { data: salesByCategory } = useLocalApi({
    apiToCall: (data) => getSalesByCategory(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo, reportType },
    effectDependency: [period, appliedRange],
  }) as { data: SalesByCategoryItem[] };

  const revenue = salesInsights.totalSalesAmount ?? 0;
  const cash = salesInsights.cashAmountPaid ?? 0;
  const card = salesInsights.cardAmountPaid ?? 0;
  const discount = salesInsights.discountAmount ?? 0;
  const cashPct = cash + card > 0 ? Math.round((cash / (cash + card)) * 100) : 0;
  const netRevenue = revenue - staticStats.refunds;

  const goldByKarat = [...(salesInsights.goldByKarat ?? [])].sort((a, b) => b.weight - a.weight);
  const totalWeight = goldByKarat.reduce((sum, k) => sum + k.weight, 0);
  const maxKaratWeight = Math.max(...goldByKarat.map((k) => k.weight), 1);
  const karat21 = goldByKarat.find((k) => k.karatType === 21);
  const karat18 = goldByKarat.find((k) => k.karatType === 18);

  const maxCategoryRevenue = Math.max(...salesByCategory.map((c) => c.revenue), 1);

  const revenueChartData = salesOverTime.map((d) => ({ label: d.dateLabel, value: d.revenue }));

  const topCustomerRows = staticStats.topCustomers.map((c) => ({
    key: c.name,
    primary: c.name,
    secondary: `${c.transactions} sales`,
    value: fmtCurrency(c.spent),
    valueColor: "var(--admin-green)",
  }));

  return (
    <div id="sales-reports" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaChartBar className="icon" />
          <span>Sales reports</span>
        </h1>
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
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="range-sep">to</span>
          <input
            type="date"
            className="date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <button className="apply-btn" onClick={handleApplyRange}>
            Apply
          </button>
        </div>
      </div>

      <div className="stats4">
        <ReportStatCard
          label="Total revenue"
          value={fmtCurrency(revenue)}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub={`${staticStats.transactions.toLocaleString()} transactions`}
        />
        <ReportStatCard
          label="Refunds"
          value={`-${fmtCurrency(staticStats.refunds)}`}
          valueColor="var(--admin-red)"
          accentColor="var(--admin-red)"
          sub={`Net: ${fmtCurrency(netRevenue)}`}
        />
        <ReportStatCard
          label="Items sold"
          value={staticStats.itemsSold.toLocaleString()}
          accentColor="var(--admin-gold)"
          sub={`${totalWeight.toLocaleString()}g of gold`}
        />
        <ReportStatCard
          label="Avg sale"
          value={fmtCurrency(staticStats.avgSale)}
          accentColor="var(--admin-purple)"
          sub="per transaction"
        />
      </div>

      <div className="stats4">
        <ReportStatCard
          label="Cash collected"
          value={fmtCurrency(cash)}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub={`${cashPct}% of payments`}
        />
        <ReportStatCard
          label="Card collected"
          value={fmtCurrency(card)}
          valueColor="var(--admin-purple)"
          accentColor="var(--admin-purple)"
          sub={`${100 - cashPct}% of payments`}
        />
        <ReportStatCard
          label="Discounts given"
          value={fmtCurrency(discount)}
          valueColor="var(--admin-red)"
          accentColor="var(--admin-red)"
          sub={`${revenue > 0 ? ((discount / revenue) * 100).toFixed(1) : "0.0"}% of revenue`}
        />
        <ReportStatCard
          label="Avg price per gram"
          accentColor="var(--admin-gold)"
          value={
            <span className="two-line-value">
              21K — {karat21 ? fmtCurrency(karat21.pricePerGram) : "–"}
              <br />
              18K — {karat18 ? fmtCurrency(karat18.pricePerGram) : "–"}
            </span>
          }
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Revenue over time</span>
          <div className="panel-right">
            <span className="panel-sub">{fmtCurrency(revenue)} total</span>
            <button className="expand-btn" onClick={() => setExpandedChart("revenue")}>
              <FaExpand />
            </button>
          </div>
        </div>
        {revenueChartData.length > 0 ? (
          <RevenueBarChart data={revenueChartData} formatValue={fmtCurrency} color="var(--admin-gold)" />
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Items sold over time</span>
            <button className="expand-btn" onClick={() => setExpandedChart("units")}>
              <FaExpand />
            </button>
          </div>
          <RevenueBarChart data={staticStats.unitsChart} formatValue={fmtNumber} color="var(--admin-blue)" />
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Sales by category</span>
            <button className="expand-btn" onClick={() => setExpandedChart("category")}>
              <FaExpand />
            </button>
          </div>
          {salesByCategory.length > 0 ? (
            salesByCategory.map((c) => (
              <HorizontalBarRow
                key={c.categoryName}
                label={c.categoryName}
                percent={computePercent(c.revenue, maxCategoryRevenue)}
                color="var(--admin-gold)"
                amountLabel={`${fmtCurrency(c.revenue)} · ${Math.round(c.percentage)}%`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Gold sold by karat</span>
            <span className="panel-sub">{totalWeight.toLocaleString()}g total</span>
          </div>
          {goldByKarat.length > 0 ? (
            goldByKarat.map((k) => (
              <HorizontalBarRow
                key={k.karatType}
                label={`${k.karatType}K`}
                percent={computePercent(k.weight, maxKaratWeight)}
                color="var(--admin-gold)"
                amountLabel={`${k.weight.toLocaleString()}g · ${fmtCurrency(k.pricePerGram)}/g`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>

        <ReportListPanel
          title="Top customers"
          subtitle="by spend in period"
          rows={topCustomerRows}
          emptyMessage="No customer data"
        />
      </div>

      <ItemsSoldTo dateFrom={activeRange.dateFrom} dateTo={activeRange.dateTo} />

      <ChartExpandModal
        show={expandedChart === "revenue"}
        title="Revenue over time"
        subtitle={periodLabel}
        onClose={() => setExpandedChart(null)}
      >
        {revenueChartData.length > 0 ? (
          <RevenueBarChart data={revenueChartData} formatValue={fmtCurrency} color="var(--admin-gold)" />
        ) : (
          <div className="no-data">No data available</div>
        )}
      </ChartExpandModal>

      <ChartExpandModal
        show={expandedChart === "units"}
        title="Items sold over time"
        subtitle={periodLabel}
        onClose={() => setExpandedChart(null)}
      >
        <RevenueBarChart data={staticStats.unitsChart} formatValue={fmtNumber} color="var(--admin-blue)" />
      </ChartExpandModal>

      <ChartExpandModal
        show={expandedChart === "category"}
        title="Sales by category"
        subtitle={periodLabel}
        onClose={() => setExpandedChart(null)}
      >
        {salesByCategory.length > 0 ? (
          salesByCategory.map((c) => (
            <HorizontalBarRow
              key={c.categoryName}
              label={c.categoryName}
              percent={computePercent(c.revenue, maxCategoryRevenue)}
              color="var(--admin-gold)"
              amountLabel={`${fmtCurrency(c.revenue)} · ${Math.round(c.percentage)}%`}
            />
          ))
        ) : (
          <div className="no-data">No data available</div>
        )}
      </ChartExpandModal>
    </div>
  );
};

export default SalesReports;
