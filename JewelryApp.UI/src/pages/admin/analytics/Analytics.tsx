import { useEffect, useState } from "react";
import "./analytics.scss";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaExpand,
  FaFilter,
  FaSync,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import AnalyticsSummary from "./analyticsSummary/AnalyticsSummary";
import { ReportType } from "../../../types/enums";
import useLocalApi from "../../../hooks/useLocalApi";
import {
  getSalesByCategory,
  getSalesOverTime,
  getStaffPerformance,
} from "../../../apis/analytics.api/analytics.api";
import { LuChartSpline } from "react-icons/lu";

export interface SalesByCategoryItem {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface SalesOverTimeItem {
  dateLabel: string;
  date: string;
  revenue: number;
  unitsSold: number;
}

export interface StaffPerformanceItem {
  staffName: string;
  salesAmount: number;
  commission: number;
}

ChartJS.register(
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullViewChart, setFullViewChart] = useState<null | string>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>(ReportType.AllTime);
  const [appliedFilters, setAppliedFilters] = useState<{
    dateFrom: string;
    dateTo: string;
    reportType: ReportType;
  }>({
    dateFrom: "",
    dateTo: "",
    reportType: reportType == ReportType.AllTime ? null : reportType,
  });

  const openFullView = (chartId: string) => setFullViewChart(chartId);
  const closeFullView = () => setFullViewChart(null);

  const { data: salesByCategory } = useLocalApi({
    apiToCall: (data) => getSalesByCategory(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType: appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: SalesByCategoryItem[] };

  const { data: salesOverTime } = useLocalApi({
    apiToCall: (data) => getSalesOverTime(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType: appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: SalesOverTimeItem[] };

  const { data: staffPerformance } = useLocalApi({
    apiToCall: (data) => getStaffPerformance(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType: appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: StaffPerformanceItem[] };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ----------------------------------------------
      REVENUE LINE DATA (WITHOUT UNITS SOLD)
  ---------------------------------------------- */
  const revenueLineData =
    salesOverTime && salesOverTime.length > 0
      ? {
          labels: salesOverTime.map((d) => d.dateLabel),
          datasets: [
            {
              label: "Revenue ($)",
              data: salesOverTime.map((d) => d.revenue),
              borderColor: "#D4AF37",
              backgroundColor: "rgba(212,175,55,0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        }
      : { labels: [], datasets: [] };

  /* ----------------------------------------------
      NEW SEPARATE UNITS SOLD LINE CHART
  ---------------------------------------------- */
  const unitsSoldLineData =
    salesOverTime && salesOverTime.length > 0
      ? {
          labels: salesOverTime.map((d) => d.dateLabel),
          datasets: [
            {
              label: "Units Sold",
              data: salesOverTime.map((d) => d.unitsSold),
              borderColor: "#1a3a5f",
              backgroundColor: "rgba(26,58,95,0.15)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        }
      : { labels: [], datasets: [] };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  /* ----------------------------------------------
      SALES BY CATEGORY
  ---------------------------------------------- */
  const salesByCategoryData = salesByCategory
    ? {
        labels: salesByCategory.map((c) => c.categoryName),
        datasets: [
          {
            data: salesByCategory.map((c) => c.percentage),
            backgroundColor: [
              "#D4AF37",
              "#B5942D",
              "#E6C55C",
              "#F5E9C8",
              "#6C757D",
              "#ADB5BD",
            ],
            borderColor: "#FFFFFF",
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 12, padding: 15 } },
    },
    cutout: "60%",
  };

  /* ----------------------------------------------
      STAFF PERFORMANCE
  ---------------------------------------------- */
  const staffPerformanceData =
    staffPerformance && staffPerformance.length > 0
      ? {
          labels: staffPerformance.map((s) => s.staffName),
          datasets: [
            {
              label: "Sales ($)",
              data: staffPerformance.map((s) => s.salesAmount),
              backgroundColor: "#D4AF37",
              borderRadius: 6,
            },
            {
              label: "Commission",
              data: staffPerformance.map((s) => s.commission),
              backgroundColor: "#B5942D",
              borderRadius: 6,
            },
          ],
        }
      : { labels: [], datasets: [] };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  const applyFilters = () =>
    setAppliedFilters({
      dateFrom: dateFrom,
      dateTo: dateTo,
      reportType: reportType,
    });

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setReportType(ReportType.AllTime);

    setAppliedFilters({
      dateFrom: "",
      dateTo: "",
      reportType: ReportType.AllTime,
    });
  };

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="icon">
            <FaChartBar />
          </span>
          Analytics & Graphs
        </h1>

        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setRefreshKey((prev) => prev + 1)}
          >
            <FaSync />
            Refresh Data
          </button>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="analytics-card analytics-filter-card">
        <div className="analytics-filter-header">
          <h3 className="card-title">Filter Analytics</h3>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <div className="date-range-row">
                <input
                  type="date"
                  className="form-control"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />

                <input
                  type="date"
                  className="form-control"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select
                className="form-control"
                value={reportType}
                onChange={(e) => setReportType(Number(e.target.value))}
              >
                <option value={ReportType.AllTime}>All Time</option>
                <option value={ReportType.Daily}>Daily</option>
                <option value={ReportType.Weekly}>Weekly</option>
                <option value={ReportType.Monthly}>Monthly</option>
                <option value={ReportType.Yearly}>Yearly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary btn-md" onClick={applyFilters}>
            <FaFilter />
            Apply Filters
          </button>

          <button className="btn btn-gray btn-md" onClick={resetFilters}>
            <FaTimes />
            Reset
          </button>
        </div>
      </div>

      {/* CHART GRID */}
      <div className="analytics-grid">
        {/* SALES OVER TIME (REVENUE) */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <span className="icon-circle">
                <FaChartLine />
              </span>
              Revenue Over Time
            </h3>

            {!!salesOverTime.length && (
              <button
                className="btn btn-outline btn-small"
                onClick={() => openFullView("revenue")}
              >
                <FaExpand />
              </button>
            )}
          </div>

          <div className="chart-container">
            {salesOverTime && salesOverTime.length > 0 ? (
              <Line data={revenueLineData} options={lineOptions} />
            ) : (
              <div className="no-data">
                <FaChartLine />
                No data available
              </div>
            )}
          </div>
        </div>

        {/* UNITS SOLD OVER TIME — NEW CARD */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <span className="icon-circle">
                <LuChartSpline />
              </span>
              Units Sold Over Time
            </h3>

            {!!salesOverTime.length && (
              <button
                className="btn btn-outline btn-small"
                onClick={() => openFullView("units_sold")}
              >
                <FaExpand />
              </button>
            )}
          </div>

          <div className="chart-container">
            {salesOverTime && salesOverTime.length > 0 ? (
              <Line data={unitsSoldLineData} options={lineOptions} />
            ) : (
              <div className="no-data">
                <FaChartLine />
                No data available
              </div>
            )}
          </div>
        </div>

        {/* SALES BY CATEGORY */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <span className="icon-circle">
                <FaChartPie />
              </span>
              Sales by Category
            </h3>

            {!!salesByCategory.length && (
              <button
                className="btn btn-outline btn-small"
                onClick={() => openFullView("sales_by_category")}
              >
                <FaExpand />
              </button>
            )}
          </div>
          <div className="chart-container chart-container-doughnut">
            {salesByCategory && salesByCategory.length > 0 ? (
              <Doughnut data={salesByCategoryData} options={doughnutOptions} />
            ) : (
              <div className="no-data">
                <FaChartPie />
                No data available
              </div>
            )}
          </div>
        </div>

        {/* STAFF PERFORMANCE */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <span className="icon-circle">
                <FaUser />
              </span>
              Staff Performance
            </h3>

            {!!staffPerformance.length && (
              <button
                className="btn btn-outline btn-small"
                onClick={() => openFullView("staff_performance")}
              >
                <FaExpand />
              </button>
            )}
          </div>

          <div className="chart-container">
            {staffPerformance && staffPerformance.length > 0 ? (
              <Bar data={staffPerformanceData} options={barOptions} />
            ) : (
              <div className="no-data">
                <FaUser />
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <AnalyticsSummary
        appliedFilters={appliedFilters}
        refreshKey={refreshKey}
      />

      {/* FULLSCREEN COMPONENT */}
      {fullViewChart && (
        <div className="fullscreen-overlay" onClick={closeFullView}>
          <div
            className="fullscreen-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeFullView}>
              <FaTimes />
            </button>

            <div className="fullscreen-chart-container">
              {fullViewChart === "revenue" && (
                <Line data={revenueLineData} options={lineOptions} />
              )}

              {fullViewChart === "units_sold" && (
                <Line data={unitsSoldLineData} options={lineOptions} />
              )}

              {fullViewChart === "sales_by_category" && (
                <Doughnut
                  data={salesByCategoryData}
                  options={doughnutOptions}
                />
              )}

              {fullViewChart === "staff_performance" && (
                <Bar data={staffPerformanceData} options={barOptions} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
