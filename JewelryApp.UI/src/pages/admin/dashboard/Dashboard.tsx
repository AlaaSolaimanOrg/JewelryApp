import { getDashboardInsights } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { KaratType } from "../../../types/enums";
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
} from "react-icons/fa";
import TopSellingCategories from "./TopSellingCategories/TopSellingCategories";

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
      apiToCall: (data) => getDashboardInsights(data.payload),
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
          <div className="kpi-value">{formatCurrency(salesToday?.amount)}</div>
          <div className={`kpi-trend ${salesToday?.isIncrease ? "" : "down"}`}>
            {salesToday?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(salesToday?.changePercentage).toFixed(1)}% from yesterday
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Stock Value</div>
            <div className="kpi-icon">
              <FaGem className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatCurrency(stockValue)}</div>
          <div className="kpi-trend down">
            <FaArrowDown className="icon" /> 2.1% from last month
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Customers</div>
            <div className="kpi-icon">
              <FaUsers className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(customers?.count)}</div>
          <div className={`kpi-trend ${customers?.isIncrease ? "" : "down"}`}>
            {customers?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(customers?.changePercentage).toFixed(1)}% from last week
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Items Sold</div>
            <div className="kpi-icon">
              <FaShoppingCart className="icon" />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(itemsSold?.count)}</div>
          <div className={`kpi-trend ${itemsSold?.isIncrease ? "" : "down"}`}>
            {itemsSold?.isIncrease ? (
              <FaArrowUp className="icon" />
            ) : (
              <FaArrowDown className="icon" />
            )}
            {Math.abs(itemsSold?.changePercentage).toFixed(1)}% from yesterday
          </div>
        </div>
      </div>

      <div className="stock-weight-section">
        <h3 className="section-title">Total Stock Weight</h3>
        <div className="stock-weight-grid">
          {stockWeightByKarat?.map((stockWeight) => (
            <div key={stockWeight.karatType} className="weight-card">
              <div className="weight-header">
                <div className="weight-title">
                  <span className="mr-2">Total Stock Weight</span>
                  <span className="karatType">{stockWeight?.karatType}K</span>
                </div>
                <FaGem className="icon me-2" />
              </div>
              <div className="weight-value">
                {formatNumber(stockWeight?.weight)} g
              </div>
            </div>
          ))}
        </div>
      </div>

      <TopSellingCategories />
    </div>
  );
};

export default Dashboard;
