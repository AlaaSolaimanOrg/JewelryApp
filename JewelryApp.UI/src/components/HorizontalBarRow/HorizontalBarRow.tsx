import type { HorizontalBarRowProps } from "./HorizontalBarRow.type";
import "./horizontalBarRow.scss";

const HorizontalBarRow = ({
  label,
  amountLabel,
  percent,
  color,
}: HorizontalBarRowProps) => {
  return (
    <div className="horizontalBarRow">
      <span className="hbar-name">{label}</span>
      <div className="hbar-track">
        <div
          className="hbar-fill"
          style={{ width: `${Math.max(1, percent)}%`, background: color }}
        />
      </div>
      <span className="hbar-amt">{amountLabel}</span>
    </div>
  );
};

export default HorizontalBarRow;
