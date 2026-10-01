import { safeValue } from "../../../../utils";
import "./staffStats.scss";
import type { StaffStatsProps } from "./StaffStats.type";

const StaffStats = ({ stats }: StaffStatsProps) => {
  const totalStaff = safeValue(stats?.totalStaff, 0);
  const activeCount = safeValue(stats?.activeStaff, 0);
  const inactiveCount = safeValue(stats?.inactiveStaff, 0);
  const adminsCount = safeValue(stats?.adminsCount, 0);
  const terminalsCount = safeValue(stats?.terminalsCount, 0);

  return (
    <div className="staffStats">
      <div className="scard sc-blue">
        <div className="scard-label">Total staff</div>
        <div className="scard-value">{totalStaff}</div>
        <div className="scard-sub">
          {activeCount} active · {inactiveCount} inactive
        </div>
      </div>
      <div className="scard sc-purple">
        <div className="scard-label">Admins</div>
        <div className="scard-value sv-purple">{adminsCount}</div>
        <div className="scard-sub">full system access</div>
      </div>
      <div className="scard sc-amber">
        <div className="scard-label">POS terminals</div>
        <div className="scard-value sv-amber">{terminalsCount}</div>
        <div className="scard-sub">terminal-role logins</div>
      </div>
      <div className="scard sc-green">
        <div className="scard-label">Active now</div>
        <div className="scard-value sv-green">{activeCount}</div>
        <div className="scard-sub">can log in today</div>
      </div>
    </div>
  );
};

export default StaffStats;
