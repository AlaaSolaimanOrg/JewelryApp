import type { ReportListPanelProps } from "./ReportListPanel.type";
import "./reportListPanel.scss";

const ReportListPanel = ({
  title,
  subtitle,
  rows,
  emptyMessage,
  search,
}: ReportListPanelProps) => {
  return (
    <div className="reportListPanel">
      <div className="rlp-head">
        <div className="rlp-head-text">
          <span className="rlp-title">{title}</span>
          {subtitle && <span className="rlp-subtitle">{subtitle}</span>}
        </div>
        {search && (
          <input
            type="text"
            className="rlp-search"
            placeholder={search.placeholder ?? "Search..."}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            autoComplete="off"
          />
        )}
      </div>
      <div className="rlp-body">
        {rows.length ? (
          rows.map((row) => (
            <div className="rlp-row" key={row.key}>
              <div>
                <div className="rlp-name">{row.primary}</div>
                {row.secondary && <div className="rlp-sub">{row.secondary}</div>}
              </div>
              <span
                className={`rlp-val${row.valueBg ? " pill" : ""}`}
                style={{
                  color: row.valueColor,
                  background: row.valueBg,
                }}
              >
                {row.value}
              </span>
            </div>
          ))
        ) : (
          <div className="rlp-empty">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ReportListPanel;
