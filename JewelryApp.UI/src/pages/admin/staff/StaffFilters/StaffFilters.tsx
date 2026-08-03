import { FaSearch } from "react-icons/fa";
import { getAllRoles } from "../../../../apis/users.api/users.api";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import "./staffFilters.scss";
import type { StaffFiltersProps } from "./StaffFilters.type";

const StaffFilters = ({
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onSearchChange,
}: StaffFiltersProps) => {
  const { data: allRoles } = useLocalApiSearchSortPagination<string>({
    apiToCall: () => getAllRoles(),
  });

  return (
    <div className="staffFilters">
      <select
        className="f-select"
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
      >
        <option value="">All roles</option>
        {allRoles?.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <select
        className="f-select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="">All status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="search-wrap">
        <FaSearch className="search-ico" />
        <input
          type="text"
          className="search-input"
          placeholder="Search name, email, phone..."
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default StaffFilters;
