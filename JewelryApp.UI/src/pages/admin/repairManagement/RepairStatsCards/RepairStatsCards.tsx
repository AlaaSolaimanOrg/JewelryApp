import { getRepairAnalytics } from "../../../../apis/repairs.api/repairs.api";
import useLocalApi from "../../../../hooks/useLocalApi";
import "./repairStatsCards.scss";

interface RepairAnalytics {
  totalRepairs: number;
  completedRepairs: number;
  pendingRepairs: number;
  totalRevenue: number;
  averageRepairTime: number;
}

const RepairStatsCards = () => {
  const { data: analytics } = useLocalApi({
    apiToCall: () => getRepairAnalytics(),
  }) as {
    data: RepairAnalytics;
  };

  return (
    <div className="repair-analytics">
      <div className="repair-analytics__card total-repairs">
        <h3>Total Repairs</h3>
        <div className="value">{analytics.totalRepairs}</div>
      </div>

      <div className="repair-analytics__card pending">
        <h3>Pending Repairs</h3>
        <div className="value">{analytics.pendingRepairs}</div>
      </div>

      <div className="repair-analytics__card completed">
        <h3>Completed Repairs</h3>
        <div className="value">{analytics.completedRepairs}</div>
      </div>

      <div className="repair-analytics__card revenue">
        <h3>Total Revenue</h3>
        <div className="value">${analytics.totalRevenue}</div>
      </div>

      <div className="repair-analytics__card avg-time">
        <h3>Avg. Repair Time</h3>
        <div className="value">{analytics.averageRepairTime}</div>
      </div>
    </div>
  );
};

export default RepairStatsCards;
