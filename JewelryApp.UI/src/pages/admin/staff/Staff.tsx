import { useState } from "react";
import { FaPlus, FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllUsers,
  restoreUser,
  softDeleteUser,
} from "../../../apis/users.api/users.api";
import { getUserStats } from "../../../apis/userStats.api/userStats.api";

import Paginator from "../../../components/Paginator/Paginator";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./staff.scss";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import {
  buildStaffHeaders,
  buildStaffTableData,
  getStatusFilterValue,
  type User,
} from "./Staff.utils";
import StaffStats from "./StaffStats/StaffStats";
import type { UserStats } from "./StaffStats/StaffStats.type";
import StaffFilters from "./StaffFilters/StaffFilters";
import DeleteStaffModal from "./DeleteStaffModal/DeleteStaffModal";

const Staff = () => {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const {
    data: users,
    isLoading: isLoadingUsers,
    fetchData: recallGetUsers,
    sortCriteria,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<User>({
    apiToCall: (data) => getAllUsers(data.payload),
    extraPayload: {
      role: roleFilter || undefined,
      isActive: getStatusFilterValue(statusFilter),
    },
    extraEffectDependency: [roleFilter, statusFilter],
  });

  const { data: userStats, fetchData: recallStats } = useLocalApi({
    apiToCall: () => getUserStats(),
    effectDependency: [],
  }) as { data: UserStats | null; fetchData: () => void };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    onPaginationChange(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onPaginationChange(1);
  };

  const handleEditUser = (userId: number) => {
    navigate(`/admin/editStaff/${userId}`);
  };

  const handleToggleStatus = (user: User) => {
    const payload = { userId: String(user.id) };
    const apiToCall = user.isActive ? softDeleteUser : restoreUser;
    apiToCall(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          recallGetUsers();
          recallStats();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  const handleStaffDeleted = () => {
    recallGetUsers();
    recallStats();
    setDeleteTarget(null);
  };

  const staffMembersHeaders = buildStaffHeaders(sortCriteria, onSortChange);
  const staffMembersData = buildStaffTableData(users, {
    onToggleStatus: handleToggleStatus,
    onEdit: handleEditUser,
    onDelete: setDeleteTarget,
  });

  return (
    <div id="staff" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUserShield className="icon" /> <span>Staff management</span>
        </h1>

        <div className="page-actions">
          <Link to={"/admin/addStaff"} className="text-decoration-none">
            <button className="btn-md btn-gold">
              <FaPlus /> Add staff
            </button>
          </Link>
        </div>
      </div>

      <StaffStats stats={userStats} />

      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            Staff members ({pagination.totalRecords})
          </span>
          <StaffFilters
            roleFilter={roleFilter}
            onRoleFilterChange={handleRoleFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onSearchChange={onSearchChange}
          />
        </div>
        <CustomTable
          headers={staffMembersHeaders}
          data={staffMembersData}
          isLoading={isLoadingUsers}
        />
        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
          maxPages={4}
        />
      </div>

      <DeleteStaffModal
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleStaffDeleted}
      />
    </div>
  );
};

export default Staff;
