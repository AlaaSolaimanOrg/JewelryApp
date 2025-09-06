import {
  FaCheckCircle,
  FaEdit,
  FaMinusCircle,
  FaPlus,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import "./staff.scss";
import CustomTable from "../../../components/Table/CustomTable";

const Staff = () => {
  const staffMembersHeaders = [
    "Name",
    "Role",
    "Email",
    "LastLogin",
    "Status",
    "Actions",
  ];

  const staffMembersData = [
    {
      Name: "Admin Manager",
      Role: "Administrator",
      Email: "admin@example.com",
      LastLogin: "Today, 09:24 AM",
      Status: <span className="tag tag-new">Active</span>,
      Actions: (
        <>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "Inventory Specialist",
      Role: "Inventory Manager",
      Email: "inventory@example.com",
      LastLogin: "Yesterday, 04:15 PM",
      Status: <span className="tag tag-new">Active</span>,
      Actions: (
        <>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "Sales Associate",
      Role: "Sales Staff",
      Email: "sales@example.com",
      LastLogin: "Oct 28, 2023",
      Status: <span className="tag tag-new">Active</span>,
      Actions: (
        <>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "Store Manager",
      Role: "Manager",
      Email: "manager@example.com",
      LastLogin: "Oct 26, 2023",
      Status: <span className="tag tag-featured">On Leave</span>,
      Actions: (
        <>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  const permissionsHeaders = [
    "Role",
    "Inventory",
    "Customers",
    "Sales",
    "Reports",
    "Settings",
  ];

  const permissionsData = [
    {
      Role: "Administrator",
      Inventory: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Customers: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Sales: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Reports: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Settings: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
    },
    {
      Role: "Manager",
      Inventory: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Customers: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Sales: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Reports: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Settings: (
        <>
          <FaMinusCircle color="#6c757d" /> Limited
        </>
      ),
    },
    {
      Role: "Inventory Manager",
      Inventory: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Customers: (
        <>
          <FaMinusCircle color="#6c757d" /> View
        </>
      ),
      Sales: (
        <>
          <FaMinusCircle color="#6c757d" /> None
        </>
      ),
      Reports: (
        <>
          <FaMinusCircle color="#6c757d" /> Limited
        </>
      ),
      Settings: (
        <>
          <FaMinusCircle color="#6c757d" /> None
        </>
      ),
    },
    {
      Role: "Sales Staff",
      Inventory: (
        <>
          <FaMinusCircle color="#6c757d" /> View
        </>
      ),
      Customers: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Sales: (
        <>
          <FaCheckCircle color="#28a745" /> Full
        </>
      ),
      Reports: (
        <>
          <FaMinusCircle color="#6c757d" /> Limited
        </>
      ),
      Settings: (
        <>
          <FaMinusCircle color="#6c757d" /> None
        </>
      ),
    },
  ];

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
        </div>

        <CustomTable headers={staffMembersHeaders} data={staffMembersData} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Permissions Matrix</h3>
        </div>

        <CustomTable headers={permissionsHeaders} data={permissionsData} />
      </div>
    </div>
  );
};

export default Staff;
