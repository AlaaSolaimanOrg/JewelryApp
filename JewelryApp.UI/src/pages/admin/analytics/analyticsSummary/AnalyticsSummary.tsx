import {
  FaAward,
  FaChartLine,
  FaDollarSign,
  FaGem,
  FaRing,
  FaUserTie,
} from "react-icons/fa";
import { getAnalyticsSummary } from "../../../../apis/analytics.api/analytics.api";
import useLocalApi from "../../../../hooks/useLocalApi";
import { smartRound } from "../../../../utils";
import "./analyticsSummary.scss";
import { ReportType } from "../../../../types/enums";

export interface AnalyticsSummary {
  avgDailySales: number;
  avgDailySalesChange: number;
  bestSellingCategory: string;
  bestSellingCategoryPercentage: number;
  topPerformer: string;
  topPerformerSales: number;
  mostValuableKarat: string;
  mostValuableKaratPercentage: number;
}
const AnalyticsSummary = ({ appliedFilters, refreshKey }) => {
  const { data: analyticsSummary } = useLocalApi({
    apiToCall: (data) => getAnalyticsSummary(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: AnalyticsSummary };

  return (
    <div className="analytics-summary-card">
      <div className="analytics-summary-header">
        <h3 className="card-title">Analytics Summary</h3>
      </div>

      <div className="kpi-grid-analytics">
        {/* Avg Daily Sales */}
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Avg. Daily Sales</div>
            <div className="kpi-icon">
              <FaDollarSign />
            </div>
          </div>

          <div className="kpi-value">
            ${smartRound(analyticsSummary.avgDailySales)}
          </div>
        </div>

        {/* Best Selling Category */}
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Best Selling Category</div>
            <div className="kpi-icon">
              <FaRing />
            </div>
          </div>

          <div className="kpi-value">
            {analyticsSummary.bestSellingCategory || "-"}
          </div>

          <div className="kpi-trend">
            <FaChartLine />
            {smartRound(analyticsSummary.bestSellingCategoryPercentage)}% of
            total sales
          </div>
        </div>

        {/* Top Performer */}
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Top Performer</div>
            <div className="kpi-icon">
              <FaUserTie />
            </div>
          </div>

          <div className="kpi-value">
            {analyticsSummary.topPerformer || "-"}
          </div>

          <div className="kpi-trend">
            <FaAward />${smartRound(analyticsSummary.topPerformerSales)} in
            sales
          </div>
        </div>

        {/* Most Valuable Karat */}
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-title">Most Valuable Karat</div>
            <div className="kpi-icon">
              <FaGem />
            </div>
          </div>

          <div className="kpi-value">
            {analyticsSummary.mostValuableKarat || "-"}
          </div>

          <div className="kpi-trend">
            <FaGem />
            {smartRound(analyticsSummary.mostValuableKaratPercentage)}% of
            inventory value
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
