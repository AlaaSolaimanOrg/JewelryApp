import type { MiniStatCardProps } from "./MiniStatCard.type";
import "./miniStatCard.scss";

const MiniStatCard = ({ label, value, sub, valueColor }: MiniStatCardProps) => {
  return (
    <div className="miniStatCard">
      <div className="mini-label">{label}</div>
      <div className="mini-val" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      {sub && <div className="mini-sub">{sub}</div>}
    </div>
  );
};

export default MiniStatCard;
