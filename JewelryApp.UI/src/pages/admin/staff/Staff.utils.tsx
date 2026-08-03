import { FaEdit, FaTrash } from "react-icons/fa";
import type { TableHeader } from "../../../components/tables/Table/CustomTable";
import { SortDirection } from "../../../types/enums";
import type { SortCriteria } from "../../../types/general";
import { handleSort } from "../../../utils";

export interface User {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

const AVATAR_COLORS = [
  "#d4a017",
  "#5ba3e6",
  "#9b8de6",
  "#4caf7c",
  "#e6a23c",
  "#e65b5b",
];

export const getAvatarColor = (id: number): string =>
  AVATAR_COLORS[id % AVATAR_COLORS.length];

export const getInitials = (name: string): string => {
  const parts = name?.trim().split(/\s+/) || [];
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
};

export const getRoleClass = (role: string): string => {
  if (role === "Admin") return "r-admin";
  if (role === "PosRole") return "r-pos";
  if (role === "TerminalRole") return "r-terminal";
  return "r-default";
};

export const renderSortLabel = (
  label: string,
  field: string,
  sortCriteria: SortCriteria
) => (
  <>
    {label}
    {sortCriteria.sortBy === field && (
      <span className="arrow">
        {sortCriteria.sortDirection === SortDirection.Ascending ? "▲" : "▼"}
      </span>
    )}
  </>
);

// "" (no filter) -> undefined, "active" -> true, "inactive" -> false
export const getStatusFilterValue = (
  statusFilter: string
): boolean | undefined => {
  if (statusFilter === "active") return true;
  if (statusFilter === "inactive") return false;
  return undefined;
};

export const buildStaffHeaders = (
  sortCriteria: SortCriteria,
  onSortChange: (sortBy: string, value?: SortDirection) => void
): TableHeader[] => [
  {
    key: "name",
    label: renderSortLabel("Name", "fullName", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("fullName", sortCriteria, onSortChange),
  },
  { key: "roles", label: "Role(s)" },
  { key: "phone", label: "Phone" },
  {
    key: "createdAt",
    label: renderSortLabel("Created At", "createdAt", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("createdAt", sortCriteria, onSortChange),
  },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export type StaffRowActions = {
  onToggleStatus: (user: User) => void;
  onEdit: (userId: number) => void;
  onDelete: (user: User) => void;
};

export const buildStaffTableData = (
  users: User[],
  { onToggleStatus, onEdit, onDelete }: StaffRowActions
) =>
  users?.map((user) => ({
    rowClassName: user.isActive ? "" : "inactive-row",
    name: (
      <div className="staff-name">
        <div
          className="staff-av"
          style={{ background: getAvatarColor(user.id) }}
        >
          {getInitials(user.fullName ?? user.userName)}
        </div>
        <div>
          <div className="staff-name-txt">{user.fullName ?? user.userName}</div>
          <div className="staff-name-sub">{user.email}</div>
        </div>
      </div>
    ),
    roles: (
      <>
        {user.roles?.map((role) => (
          <span key={role} className={`role-pill ${getRoleClass(role)}`}>
            {role}
          </span>
        ))}
      </>
    ),
    phone: user.phoneNumber || "—",
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    status: (
      <span
        className={`status-pill ${user.isActive ? "st-active" : "st-inactive"}`}
        onClick={() => onToggleStatus(user)}
        title="Click to toggle"
      >
        {user.isActive ? "Active" : "Inactive"}
      </span>
    ),
    actions: (
      <>
        <button
          className="act-ico act-edit"
          data-tip="Edit"
          onClick={() => onEdit(user.id)}
        >
          <FaEdit size={14} />
        </button>
        <button
          className="act-ico act-del"
          data-tip="Remove"
          onClick={() => onDelete(user)}
          disabled={!user.isActive}
        >
          <FaTrash size={14} />
        </button>
      </>
    ),
  }));
