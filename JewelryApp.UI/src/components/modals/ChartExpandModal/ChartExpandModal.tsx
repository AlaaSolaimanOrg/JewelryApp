import { FaTimes } from "react-icons/fa";
import type { ChartExpandModalProps } from "./ChartExpandModal.type";
import "./chartExpandModal.scss";

const ChartExpandModal = ({
  show,
  title,
  subtitle,
  onClose,
  children,
}: ChartExpandModalProps) => {
  if (!show) return null;

  return (
    <div className="chartExpandModal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <div>
            <div className="mo-title">{title}</div>
            {subtitle && <div className="mo-sub">{subtitle}</div>}
          </div>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="mo-body">{children}</div>
      </div>
    </div>
  );
};

export default ChartExpandModal;
