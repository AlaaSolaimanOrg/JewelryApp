import type { RevenueBarChartProps } from "./RevenueBarChart.type";
import "./revenueBarChart.scss";

const MAX_BAR_HEIGHT = 120;

const RevenueBarChart = ({ data, formatValue, color = "var(--admin-green)" }: RevenueBarChartProps) => {
  const maxVal = Math.max(...data.map((d) => d.value)) || 1;
  const skipLabels = data.length > 15;

  return (
    <div className="revenueBarChart">
      {data.map((d, i) => {
        const height = Math.max(1, (d.value / maxVal) * MAX_BAR_HEIGHT);
        const showLabel =
          !skipLabels || i % 5 === 4 || i === data.length - 1;
        const showVal = d.value > 0;

        return (
          <div className="bar-group" key={`${d.label}-${i}`}>
            <div className="bar-val" style={{ visibility: showVal ? "visible" : "hidden" }}>
              {formatValue(d.value)}
            </div>
            <div
              className="bar"
              style={{
                height,
                background: d.value > 0 ? color : "var(--admin-bg5)",
              }}
            />
            <div className="bar-label">{showLabel ? d.label : ""}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueBarChart;
