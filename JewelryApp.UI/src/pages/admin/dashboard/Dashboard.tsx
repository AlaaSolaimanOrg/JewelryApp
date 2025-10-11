import { getDashboardInsights } from "../../../apis/sales.api/sales.api";
import CustomTable, {
  type TableHeader,
} from "../../../components/Table/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import { KaratType } from "../../../types/enums";
import "./dashboard.scss";

// Import icons from react-icons/fa
import {
  FaHome,
  FaSyncAlt,
  FaShoppingBag,
  FaGem,
  FaUsers,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
} from "react-icons/fa";

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
  const { data: dashboardInsights, fetchData } = useLocalApi({
    apiToCall: (data) => getDashboardInsights(data.payload),
  }) as {
    data: DashboardInsights;
    fetchData: () => void;
  };

  const handleRefresh = () => {
    fetchData();
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

  const headers: TableHeader[] = [
    { key: "product", label: "Product", width: "200px" },
    { key: "category", label: "Category", width: "150px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "unitsSold", label: "Units Sold", width: "120px" },
    { key: "revenue", label: "Revenue", width: "150px" },
  ];

  const data = [
    {
      product: "Diamond Engagement Ring",
      category: "Rings",
      karat: "18K",
      unitsSold: 24,
      revenue: "$12,450",
    },
    {
      product: "Gold Bangle Set",
      category: "Bangles",
      karat: "22K",
      unitsSold: 18,
      revenue: "$8,250",
    },
    {
      product: "Sapphire Pendant",
      category: "Necklaces",
      karat: "21K",
      unitsSold: 15,
      revenue: "$7,890",
    },
    {
      product: "Emerald Earrings",
      category: "Earrings",
      karat: "18K",
      unitsSold: 12,
      revenue: "$5,670",
    },
    {
      product: "Platinum Wedding Band",
      category: "Rings",
      karat: "Platinum",
      unitsSold: 10,
      revenue: "$4,320",
    },
  ];

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
                  Total Stock Weight
                  <span className="karatType">
                    {KaratType[stockWeight?.karatType]}
                  </span>
                  K
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

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Selling Products</h3>
          <div>
            <button className="btn-md btn-gray">
              <FaDownload className="icon me-1" /> Export
            </button>
          </div>
        </div>
        <CustomTable headers={headers} data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
