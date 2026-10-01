import type { TierBarRowProps } from "./TierBarRow.type";
import "./tierBarRow.scss";

const TierBarRow = ({ badgeLabel, badgeColor, badgeBg, percent, amountLabel, onClick }: TierBarRowProps) => {
  return (
    <div className={`tierBarRow${onClick ? " clickable" : ""}`} onClick={onClick}>
      <span className="tbr-badge" style={{ background: badgeBg, color: badgeColor }}>
        {badgeLabel}
      </span>
      <div className="tbr-track">
        <div className="tbr-fill" style={{ width: `${Math.max(2, percent)}%`, background: badgeColor }} />
      </div>
      <span className="tbr-amt">{amountLabel}</span>
    </div>
  );
};

export default TierBarRow;
