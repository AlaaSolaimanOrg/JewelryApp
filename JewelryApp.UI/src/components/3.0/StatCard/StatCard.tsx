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
  accentColor?: string;
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
  accentColor,
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

  const accentStyle: CSSProperties | undefined = accentColor
    ? ({ "--dash-stat-accent": accentColor } as CSSProperties)
    : undefined;

  return (
    <div
      className={accentColor ? `${classes} dash-stat-accented` : classes}
      style={accentStyle}
      onClick={onClick}
    >
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
