import type { AdminStatCardProps } from "./AdminStatCard.type";
import "./adminStatCard.scss";

const AdminStatCard = ({ value, label, valueColor }: AdminStatCardProps) => {
  return (
    <div className="adminStatCard">
      <div className="stat-n" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      <div className="stat-l">{label}</div>
    </div>
  );
};

export default AdminStatCard;
