import type { SplitBarRowProps } from "./SplitBarRow.type";
import "./splitBarRow.scss";

const SplitBarRow = ({ label, percentage, amountLabel, color }: SplitBarRowProps) => {
  return (
    <div className="splitBarRow">
      <span className="sbr-label">{label}</span>
      <div className="sbr-track">
        <div className="sbr-fill" style={{ width: `${Math.max(1, percentage)}%`, background: color }}>
          {percentage}%
        </div>
      </div>
      <span className="sbr-amt" style={{ color }}>
        {amountLabel}
      </span>
    </div>
  );
};

export default SplitBarRow;
