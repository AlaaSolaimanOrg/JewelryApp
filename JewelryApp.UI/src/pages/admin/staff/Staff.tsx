import { FaEdit, FaPlus, FaTrash, FaUserShield } from "react-icons/fa";
import { getAllUsers } from "../../../apis/users.api/users.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import "./staff.scss";

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
  const {
    data: users,
    // isLoading: isLoadingUsers,
    // fetchData: recallGetUsers,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<User>({
    apiToCall: () => getAllUsers(),
  });

  // Table headers
  const staffMembersHeaders = [
    "Name",
    "Role(s)",
    "Email",
    "Phone",
    "Created At",
    "Status",
    "Actions",
  ];

  // Dynamic data mapping
  const staffMembersData = users?.map((user) => ({
    Name: user.fullName ?? user.userName,
    "Role(s)": user.roles?.join(", "),
    Email: user.email,
    Phone: user.phoneNumber ?? "—",
    "Created At": new Date(user.createdAt).toLocaleDateString(),
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
          className="action-btn danger"
          title="Delete"
          onClick={() => handleDeleteUser(user.id)}
        >
          <FaTrash />
        </button>
      </>
    ),
  }));

  const handleEditUser = (userId: number) => {
    // navigate(`/admin/editUser/${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    // call delete user API then recallGetUsers();
  };

  return (
    <div id="staff" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUserShield className="icon" /> <span>Staff Management</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaPlus /> Add Staff
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Staff Members</h3>
          <div style={{ width: "250px" }}>
            <input
              type="text"
              placeholder="Search staff..."
              className="search-bar"
              onChange={onSearchChange}
            />
          </div>
        </div>

        <CustomTable headers={staffMembersHeaders} data={staffMembersData} />
      </div>

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};

export default Staff;
