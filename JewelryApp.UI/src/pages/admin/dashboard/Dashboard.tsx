import { getDashboardInsights } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import "./dashboard.scss";

// Import icons from react-icons/fa
import {
  FaArrowDown,
  FaArrowUp,
  FaGem,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaSyncAlt,
  FaUsers,
  FaWeightHanging,
} from "react-icons/fa";
import TopSellingCategories from "./TopSellingCategories/TopSellingCategories";
import { KaratType } from "../../../types/enums";

export interface DashboardInsights {
  salesToday: {
    amount: number;
    changePercentage: number;
    isIncrease: boolean;
  };
  stockValue: number;
  customers: {
    count: number;
    changePercentage: number;
    isIncrease: boolean;
  };
  itemsSold: {
    count: number;
    changePercentage: number;
    isIncrease: boolean;
  };
  stockWeightByKarat: {
    karatType: number;
    weight: number;
    displayName: string;
  }[];
}

const Dashboard = () => {
  const { data: dashboardInsights, fetchData: recallGetDashboardInsights } =
    useLocalApi({
      apiToCall: () => getDashboardInsights(),
    }) as {
      data: DashboardInsights;
      fetchData: () => void;
    };

  const handleRefresh = () => {
    recallGetDashboardInsights();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Loading state
  if (!dashboardInsights) {
    return (
      <div id="dashboard" className="page active">
        <div className="page-header">
          <h1 className="page-title">
            <FaHome className="icon me-2" />
            <span>Admin Dashboard</span>
          </h1>
        </div>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  const { salesToday, stockValue, customers, itemsSold, stockWeightByKarat } =
    dashboardInsights;

  return (
    <div id="dashboard" className="page active">
      <div className="page-header">
        <h1 className="page-title">
          <FaHome className="icon me-2" />
          <span>Admin Dashboard</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold" onClick={handleRefresh}>
            <FaSyncAlt className="icon me-1" /> Refresh
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Sales Today</div>
            <div className="kpi-icon">
              <FaShoppingBag className="icon" />
            </div>
          </div>
          <div className="kpi-value">
            {formatCurrency(salesToday?.amount ?? 0)}
          </div>
          <div className={`kpi-trend ${salesToday?.isIncrease ? "" : "down"}`}>
            {salesToday?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(salesToday?.changePercentage ?? 0).toFixed(1)}% from
            yesterday
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Stock Value</div>
            <div className="kpi-icon">
              <FaGem className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatCurrency(stockValue ?? 0)}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Customers</div>
            <div className="kpi-icon">
              <FaUsers className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(customers?.count ?? 0)}</div>
          <div className={`kpi-trend ${customers?.isIncrease ? "" : "down"}`}>
            {customers?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(customers?.changePercentage ?? 0).toFixed(1)}% from last
            week
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Items Sold</div>
            <div className="kpi-icon">
              <FaShoppingCart className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(itemsSold?.count ?? 0)}</div>
          <div className={`kpi-trend ${itemsSold?.isIncrease ? "" : "down"}`}>
            {itemsSold?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(itemsSold?.changePercentage ?? 0).toFixed(1)}% from
            yesterday
          </div>
        </div>
      </div>

      <div className="stock-weight-section">
        <h3 className="section-title">Total Stock Weight</h3>
        <div className="stock-weight-grid">
          {Object.values(KaratType)
            ?.filter((v) => typeof v === "number")
            ?.map((karatType) => {
              const stockWeight = stockWeightByKarat?.find(
                (stockWeight) => stockWeight.karatType == karatType
              );

              return (
                <div key={karatType} className="weight-card">
                  <div className="weight-header">
                    <div className="weight-title">
                      <span className="mr-2">Total Stock Weight</span>
                      <span className="karatType">{karatType}K</span>
                    </div>
                    <FaWeightHanging className="icon me-2" />
                  </div>
                  <div className="weight-value">
                    {formatNumber(stockWeight?.weight ?? 0)} g
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <TopSellingCategories />
    </div>
  );
};

export default Dashboard;
