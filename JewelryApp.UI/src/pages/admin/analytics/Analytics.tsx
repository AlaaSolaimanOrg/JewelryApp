import { useEffect } from "react";
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
import { FaChartLine, FaChartPie, FaUser } from "react-icons/fa";

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

  /* =============================
        SALES OVER TIME DATA
  ============================== */
  const salesOverTimeData = {
    labels: ["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12500, 13200, 14100, 14800, 15600, 16400, 17200],
        borderColor: "var(--primary)",
        backgroundColor: "rgba(212, 175, 55, 0.15)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Units Sold",
        data: [45, 52, 48, 55, 58, 62, 65],
        borderColor: "var(--secondary)",
        backgroundColor: "rgba(108, 117, 125, 0.15)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  /* =============================
        SALES BY CATEGORY DATA
  ============================== */
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
        label: "Sales",
        data: [35, 20, 15, 12, 10, 8],
        backgroundColor: [
          "var(--primary)",
          "var(--primary-dark)",
          "#E6C55C",
          "var(--primary-light)",
          "var(--secondary)",
          "var(--gray-dark)",
        ],
        borderWidth: 1,
      },
    ],
  };

  /* =============================
        STAFF PERFORMANCE DATA
  ============================== */
  const staffPerformanceData = {
    labels: ["Sarah J.", "Michael C.", "Emma R.", "David W.", "Lisa M."],
    datasets: [
      {
        label: "Sales ($)",
        data: [12450, 9870, 8450, 7230, 6120],
        backgroundColor: "var(--primary)",
        borderRadius: 8,
      },
      {
        label: "Commission",
        data: [1245, 987, 845, 723, 612],
        backgroundColor: "var(--primary-dark)",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
  };

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-chart-bar"></i>
          <span>Analytics & Reports</span>
        </h1>

        <div className="page-actions">
          <button className="btn btn-primary">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>

          <button className="btn btn-outline">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="analytics-grid">
        {/* === SALES OVER TIME === */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <FaChartLine /> Sales Over Time
            </h3>
          </div>

          <div className="chart-container">
            <Line data={salesOverTimeData} options={lineOptions} />
          </div>
        </div>

        {/* === SALES BY CATEGORY === */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <FaChartPie /> Sales by Category
            </h3>
          </div>

          <div className="chart-container doughnut">
            <Doughnut
              data={salesByCategoryData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" as const } },
              }}
            />
          </div>
        </div>

        {/* === STAFF PERFORMANCE === */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3 className="analytics-title">
              <FaUser />
              Staff Performance
            </h3>
          </div>

          <div className="chart-container">
            <Bar data={staffPerformanceData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
