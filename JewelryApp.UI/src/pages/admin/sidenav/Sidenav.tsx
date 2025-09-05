import {
  FaHome,
  FaGem,
  FaBox,
  FaTag,
  FaUsers,
  FaUser,
  FaCog,
  FaPrint,
  FaFile,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import "./sidenav.scss";

const SideNav = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <FaGem className="icon" />
        </div>
        <div className="logo-text">
          <h1>
            Gem<span>Luxe</span>
          </h1>
          <small>Inventory System</small>
        </div>
      </div>
      <div className="nav-links">
        <div className="nav-section">Inventory</div>
        <a href="#" className="nav-item" data-page="dashboard">
          <FaHome className="icon" />
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item" data-page="inventory">
          <FaBox className="icon" />
          <span>Inventory</span>
        </a>
        <a href="#" className="nav-item" data-page="pricing">
          <FaTag className="icon" />
          <span>Pricing</span>
        </a>
        <a href="#" className="nav-item" data-page="sales-reports">
          <FaChartLine className="icon" />
          <span>Sales Reports</span>
        </a>
        <a href="#" className="nav-item" data-page="customers">
          <FaUsers className="icon" />
          <span>Customers</span>
        </a>
        <a href="#" className="nav-item" data-page="staff">
          <FaUser className="icon" />
          <span>Staff</span>
        </a>
        <a href="#" className="nav-item" data-page="settings">
          <FaCog className="icon" />
          <span>Settings</span>
        </a>

        <div className="nav-section">Operations</div>
        <a href="#" className="nav-item" data-page="tag-printing">
          <FaPrint className="icon" />
          <span>Print Tags</span>
        </a>
        <a href="#" className="nav-item" data-page="export-data">
          <FaFile className="icon" />
          <span>Export Data</span>
        </a>
        <a href="#" className="nav-item" data-page="add-product">
          <FaPlus className="icon" />
          <span>Add Product</span>
        </a>
      </div>
    </aside>
  );
};

export default SideNav;
