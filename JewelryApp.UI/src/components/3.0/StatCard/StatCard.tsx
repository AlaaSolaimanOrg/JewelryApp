import type { CSSProperties, ReactNode } from "react";
import "./statCard.scss";

interface StatCardProps {
  label: string;
  labelIcon?: ReactNode;
  value: ReactNode;
  valueColor?: string;
  sub: ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  blurred?: boolean;
  revealed?: boolean;
  lockIcon?: ReactNode;
}

const StatCard = ({
  label,
  labelIcon,
  value,
  valueColor,
  sub,
  clickable,
  onClick,
  blurred,
  revealed,
  lockIcon,
}: StatCardProps) => {
  const classes = [
    "dash-stat-card",
    clickable ? "dash-stat-clickable" : "",
    blurred ? (revealed ? "dash-stat-revealed" : "dash-stat-blurred") : "",
  ]
    .filter(Boolean)
    .join(" ");

  const valueStyle: CSSProperties | undefined = valueColor
    ? { color: valueColor }
    : undefined;

  return (
    <div className={classes} onClick={onClick}>
      <div className="dash-stat-label">
        {labelIcon}
        {label}
      </div>
      <div className="dash-stat-value" style={valueStyle}>
        {value}
      </div>
      <div className="dash-stat-sub">{sub}</div>
      {lockIcon && <div className="dash-stat-lock">{lockIcon}</div>}
    </div>
  );
};

export default StatCard;
