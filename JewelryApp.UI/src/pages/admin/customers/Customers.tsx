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
    {
      Name: "Sarah Johnson",
      Phone: "(555) 123-4567",
      Email: "sarah@example.com",
      TotalSpent: "$24,560",
      LastPurchase: "Oct 28, 2023",
      Actions: (
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
        </>
      ),
    },
    {
      Name: "Michael Chen",
      Phone: "(555) 987-6543",
      Email: "michael@example.com",
      TotalSpent: "$18,340",
      LastPurchase: "Oct 27, 2023",
      Actions: (
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
        </>
      ),
    },
    {
      Name: "Emma Rodriguez",
      Phone: "(555) 456-7890",
      Email: "emma@example.com",
      TotalSpent: "$15,670",
      LastPurchase: "Oct 25, 2023",
      Actions: (
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
        </>
      ),
    },
    {
      Name: "David Wilson",
      Phone: "(555) 234-5678",
      Email: "david@example.com",
      TotalSpent: "$12,890",
      LastPurchase: "Oct 24, 2023",
      Actions: (
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
        </>
      ),
    },
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
