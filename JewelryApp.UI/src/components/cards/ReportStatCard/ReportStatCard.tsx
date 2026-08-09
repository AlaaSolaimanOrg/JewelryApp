import type { ReportStatCardProps } from "./ReportStatCard.type";
import "./reportStatCard.scss";

const ReportStatCard = ({
  label,
  value,
  sub,
  accentColor,
  valueColor,
}: ReportStatCardProps) => {
  return (
    <div className={`reportStatCard ${accentColor ? "" : "no-accent"}`}>
      {accentColor && (
        <span className="scard-bar" style={{ background: accentColor }} />
      )}
      <div className="scard-label">{label}</div>
      <div className="scard-value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      {sub && <div className="scard-sub">{sub}</div>}
    </div>
  );
};

export default ReportStatCard;
