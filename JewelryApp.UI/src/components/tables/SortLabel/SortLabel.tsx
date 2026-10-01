import { SortDirection } from "../../../types/enums";
import type { SortCriteria } from "../../../types/general";
import "./sortLabel.scss";

type SortLabelProps = {
  label: string;
  field: string;
  sortCriteria: SortCriteria;
};

const SortLabel = ({ label, field, sortCriteria }: SortLabelProps) => (
  <span className="sortLabel">
    {label}
    {sortCriteria.sortBy === field && (
      <span className="arrow">
        {sortCriteria.sortDirection === SortDirection.Ascending ? "▲" : "▼"}
      </span>
    )}
  </span>
);

export default SortLabel;
