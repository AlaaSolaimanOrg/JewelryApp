import { FaEdit, FaPlus, FaTrash, FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllRoles,
  getAllUsers,
  softDeleteUser,
} from "../../../apis/users.api/users.api";
import Paginator from "../../../components/Paginator/Paginator";

import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./staff.scss";
import CustomTable, { type TableHeader } from "../../../components/tables/Table/CustomTable";

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

const Staff = () => {
  const navigate = useNavigate();
  const {
    data: users,
    // isLoading: isLoadingUsers,
    fetchData: recallGetUsers,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<User>({
    apiToCall: (data) => getAllUsers(data.payload),
  });

  const { data: allRoles } = useLocalApiSearchSortPagination<string>({
    apiToCall: () => getAllRoles(),
  });

  // Table headers
  const staffMembersHeaders: TableHeader[] = [
    { key: "name", label: "Name", width: "200px", sortable: false },
    { key: "roles", label: "Role(s)", width: "150px", sortable: false },
    { key: "email", label: "Email", width: "250px", sortable: false },
    { key: "phone", label: "Phone", width: "150px", sortable: false },
    { key: "createdAt", label: "Created At", width: "150px", sortable: false },
    { key: "status", label: "Status", width: "120px", sortable: false },
    { key: "actions", label: "Actions", width: "150px", sortable: false },
  ];

  // Dynamic data mapping
  const staffMembersData = users?.map((user) => ({
    Name: user.fullName ?? user.userName,
    roles: user.roles?.join(", "),
    Email: user.email,
    Phone: user.phoneNumber ?? "—",
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    Status: user.isActive ? (
      <span className="tag tag-new">Active</span>
    ) : (
      <span className="tag tag-featured">Inactive</span>
    ),
    Actions: (
      <>
        <button
          className="action-btn"
          title="Edit"
          onClick={() => handleEditUser(user.id)}
        >
          <FaEdit />
        </button>
        <button
          className={`action-btn ${!user.isActive ? "disabledIcon" : "danger"}`}
          title="Delete"
          onClick={() => handleDeleteUser(user.id)}
          disabled={!user.isActive}
        >
          <FaTrash className="icon" />
        </button>
      </>
    ),
  }));

  const handleEditUser = (userId: number) => {
    navigate(`/admin/editStaff/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    const payload = { userId: userId };
    softDeleteUser(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          recallGetUsers();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };
  return (
    <div id="staff" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUserShield className="icon" /> <span>Staff Management</span>
        </h1>

        <div className="page-actions">
          <Link to={"/admin/addStaff"} className="text-decoration-none">
            <button className="btn-md btn-gold">
              <FaPlus /> Add Staff
            </button>
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Staff Members</h3>
          <div style={{ width: "250px" }} className="search-bar">
            <input
              type="text"
              placeholder="Search staff..."
              onChange={onSearchChange}
            />
          </div>
        </div>
        <CustomTable headers={staffMembersHeaders} data={staffMembersData} />
        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Roles</h3>
        </div>

        <CustomTable
          headers={[{ key: "role", label: "Role", width: "200px" }]}
          data={allRoles.map((role) => {
            return {
              Role: role,
            };
          })}
        />
      </div>
    </div>
  );
};

export default Staff;
