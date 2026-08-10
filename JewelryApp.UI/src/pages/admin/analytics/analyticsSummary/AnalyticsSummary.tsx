import ReportStatCard from "../../../../components/cards/ReportStatCard/ReportStatCard";
import { getAnalyticsSummary } from "../../../../apis/analytics.api/analytics.api";
import useLocalApi from "../../../../hooks/useLocalApi";
import { smartRound } from "../../../../utils";
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
    <div className="stats">
      {appliedFilters.reportType != ReportType.AllTime && (
        <ReportStatCard
          label="Avg. daily sales"
          value={`$${smartRound(analyticsSummary.avgDailySales)}`}
          accentColor="var(--admin-gold)"
        />
      )}
      <ReportStatCard
        label="Best selling category"
        value={analyticsSummary.bestSellingCategory || "-"}
        accentColor="var(--admin-blue)"
        sub={`${smartRound(analyticsSummary.bestSellingCategoryPercentage)}% of total sales`}
      />
      <ReportStatCard
        label="Top performer"
        value={analyticsSummary.topPerformer || "-"}
        accentColor="var(--admin-green)"
        valueColor="var(--admin-green)"
        sub={`$${smartRound(analyticsSummary.topPerformerSales)} in sales`}
      />
      <ReportStatCard
        label="Most valuable karat"
        value={analyticsSummary.mostValuableKarat || "-"}
        accentColor="var(--admin-purple)"
        sub={`${smartRound(analyticsSummary.mostValuableKaratPercentage)}% of inventory value`}
      />
    </div>
  );
};

export default AnalyticsSummary;
