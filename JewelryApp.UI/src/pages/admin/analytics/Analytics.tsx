import { useEffect, useState } from "react";
import "./analytics.scss";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Doughnut, Bar } from "react-chartjs-2";

import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaUser,
  FaRing,
  FaGem,
  FaDollarSign,
  FaUserTie,
  FaFilter,
  FaSync,
  FaDownload,
  FaExpand,
  FaAward,
  FaTimes,
} from "react-icons/fa";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ----------------------------------------------
        FULL VIEW STATE
  ---------------------------------------------- */
  const [fullViewChart, setFullViewChart] = useState<null | string>(null);

  const openFullView = (chartId: string) => setFullViewChart(chartId);
  const closeFullView = () => setFullViewChart(null);

  /* ----------------------------------------------
        SALES OVER TIME
  ---------------------------------------------- */
  const salesOverTimeData = {
    labels: [
      "Oct 1",
      "Oct 5",
      "Oct 10",
      "Oct 15",
      "Oct 20",
      "Oct 25",
      "Oct 30",
    ],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12500, 13200, 14100, 14800, 15600, 16400, 17200],
        borderColor: "#D4AF37",
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Units Sold",
        data: [45, 52, 48, 55, 58, 62, 65],
        borderColor: "#6C757D",
        backgroundColor: "rgba(108, 117, 125, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

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
  const salesByCategoryData = {
    labels: [
      "Rings",
      "Necklaces",
      "Earrings",
      "Bangles",
      "Bracelets",
      "Pendants",
    ],
    datasets: [
      {
        data: [35, 20, 15, 12, 10, 8],
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
  };

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
  const staffPerformanceData = {
    labels: ["Sarah J.", "Michael C.", "Emma R.", "David W.", "Lisa M."],
    datasets: [
      {
        label: "Sales ($)",
        data: [12450, 9870, 8450, 7230, 6120],
        backgroundColor: "#D4AF37",
        borderRadius: 6,
      },
      {
        label: "Commission",
        data: [1245, 987, 845, 723, 612],
        backgroundColor: "#B5942D",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
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
          <button className="btn btn-primary">
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
                <input type="date" className="form-control" />
                <input type="date" className="form-control" />
              </div>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Report Type</label>

              <select className="form-control" defaultValue="monthly">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary btn-md">
            <FaFilter />
            Apply Filters
          </button>
        </div>
      </div>

      {/* CHART GRID */}
      <div className="analytics-grid">
        {/* SALES OVER TIME */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <span className="icon-circle">
                <FaChartLine />
              </span>
              Sales Over Time
            </h3>

            <button
              className="btn btn-outline btn-small"
              onClick={() => openFullView("sales_over_time")}
            >
              <FaExpand />
            </button>
          </div>

          <div className="chart-container">
            <Line data={salesOverTimeData} options={lineOptions} />
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#D4AF37" }}
              />
              Revenue
            </div>

            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#6c757d" }}
              />
              Units Sold
            </div>
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

            <button
              className="btn btn-outline btn-small"
              onClick={() => openFullView("sales_by_category")}
            >
              <FaExpand />
            </button>
          </div>

          <div className="chart-container chart-container-doughnut">
            <Doughnut data={salesByCategoryData} options={doughnutOptions} />
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

            <button
              className="btn btn-outline btn-small"
              onClick={() => openFullView("staff_performance")}
            >
              <FaExpand />
            </button>
          </div>

          <div className="chart-container">
            <Bar data={staffPerformanceData} options={barOptions} />
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#D4AF37" }}
              />
              Sales ($)
            </div>

            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#B5942D" }}
              />
              Commission
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS SUMMARY */}
      <div className="analytics-card analytics-summary-card">
        <div className="analytics-summary-header">
          <h3 className="card-title">Analytics Summary</h3>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-title">Avg. Daily Sales</div>
              <div className="kpi-icon">
                <FaDollarSign />
              </div>
            </div>

            <div className="kpi-value">$2,450</div>

            <div className="kpi-trend">
              <FaAward />
              5.2% from last period
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-title">Best Selling Category</div>
              <div className="kpi-icon">
                <FaRing />
              </div>
            </div>

            <div className="kpi-value">Rings</div>

            <div className="kpi-trend">
              <FaChartLine />
              34% of total sales
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-title">Top Performer</div>
              <div className="kpi-icon">
                <FaUserTie />
              </div>
            </div>

            <div className="kpi-value">Sarah Johnson</div>

            <div className="kpi-trend">
              <FaAward />
              $12,450 in sales
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-title">Most Valuable Karat</div>
              <div className="kpi-icon">
                <FaGem />
              </div>
            </div>

            <div className="kpi-value">21K Gold</div>

            <div className="kpi-trend">
              <FaGem />
              42% of inventory value
            </div>
          </div>
        </div>
      </div>

      {/* FULL VIEW MODAL */}
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
              {fullViewChart === "sales_over_time" && (
                <Line data={salesOverTimeData} options={lineOptions} />
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
