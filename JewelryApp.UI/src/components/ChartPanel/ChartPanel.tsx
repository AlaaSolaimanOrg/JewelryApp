import { useState } from "react";
import ExpandButton from "../ExpandButton/ExpandButton";
import ChartExpandModal from "../modals/ChartExpandModal/ChartExpandModal";
import type { ChartPanelProps } from "./ChartPanel.type";
import "./chartPanel.scss";

const ChartPanel = ({ title, subtitle, modalSubtitle, className = "", children }: ChartPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`panel chartPanel ${className}`}>
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        <div className="panel-right">
          {subtitle && <span className="panel-sub">{subtitle}</span>}
          <ExpandButton onClick={() => setExpanded(true)} />
        </div>
      </div>
      {children}
      <ChartExpandModal
        show={expanded}
        title={title}
        subtitle={modalSubtitle ?? subtitle}
        onClose={() => setExpanded(false)}
      >
        {children}
      </ChartExpandModal>
    </div>
  );
};

export default ChartPanel;
