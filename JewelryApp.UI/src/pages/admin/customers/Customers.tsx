import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import CustomTable from "../../../components/Table/CustomTable";
import "./customers.scss";

const Customers = () => {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Total Spent",
    "Last Purchase",
    "Actions",
  ];

  const data = [
    [
      "Sarah Johnson",
      "(555) 123-4567",
      "sarah@example.com",
      "$24,560",
      "Oct 28, 2023",
      <>
        <button className="action-btn" title="View">
          <FaEye />
        </button>
        <button className="action-btn" title="Edit">
          <FaEdit />
        </button>
        <button className="action-btn danger" title="Delete">
          <FaTrash />
        </button>
      </>,
    ],
    [
      "Michael Chen",
      "(555) 987-6543",
      "michael@example.com",
      "$18,340",
      "Oct 27, 2023",
      <>
        <button className="action-btn" title="View">
          <FaEye />
        </button>
        <button className="action-btn" title="Edit">
          <FaEdit />
        </button>
        <button className="action-btn danger" title="Delete">
          <FaTrash />
        </button>
      </>,
    ],
    [
      "Emma Rodriguez",
      "(555) 456-7890",
      "emma@example.com",
      "$15,670",
      "Oct 25, 2023",
      <>
        <button className="action-btn" title="View">
          <FaEye />
        </button>
        <button className="action-btn" title="Edit">
          <FaEdit />
        </button>
        <button className="action-btn danger" title="Delete">
          <FaTrash />
        </button>
      </>,
    ],
    [
      "David Wilson",
      "(555) 234-5678",
      "david@example.com",
      "$12,890",
      "Oct 24, 2023",
      <>
        <button className="action-btn" title="View">
          <FaEye />
        </button>
        <button className="action-btn" title="Edit">
          <FaEdit />
        </button>
        <button className="action-btn danger" title="Delete">
          <FaTrash />
        </button>
      </>,
    ],
  ];

  return (
    <div id="customers" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUsers className="icon" /> <span>Customer Management</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaPlus /> Add Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer List</h3>
          <div>
            <div className="search-bar" style={{ width: "250px" }}>
              <FaSearch />
              <input type="text" placeholder="Search customers..." />
            </div>
          </div>
        </div>
        <CustomTable headers={headers} data={data} />;
      </div>
    </div>
  );
};

export default Customers;
