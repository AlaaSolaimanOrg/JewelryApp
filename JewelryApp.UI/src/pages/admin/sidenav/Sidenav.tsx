import { AiFillHome } from "react-icons/ai";
import {
  FaBox,
  FaChartLine,
  FaCog,
  FaFile,
  FaGem,
  FaPlus,
  FaPrint,
  FaTag,
  FaUser,
  FaUsers
} from "react-icons/fa";
import { Link } from "react-router-dom";
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
        <Link to="admin/dashboard" className="nav-item">
          <AiFillHome className="icon homeIcon" />
          <span>Dashboard</span>
        </Link>
        <Link to="admin/inventory" className="nav-item">
          <FaBox className="icon" />
          <span>Inventory</span>
        </Link>
        <Link to="admin/pricing" className="nav-item">
          <FaTag className="icon" />
          <span>Pricing</span>
        </Link>
        <Link to="admin/sales-reports" className="nav-item">
          <FaChartLine className="icon" />
          <span>Sales Reports</span>
        </Link>
        <Link to="admin/customers" className="nav-item">
          <FaUsers className="icon" />
          <span>Customers</span>
        </Link>
        <Link to="admin/staff" className="nav-item">
          <FaUser className="icon" />
          <span>Staff</span>
        </Link>
        <Link to="admin/settings" className="nav-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </Link>

        <div className="nav-section">Operations</div>
        <Link to="admin/tag-printing" className="nav-item">
          <FaPrint className="icon" />
          <span>Print Tags</span>
        </Link>
        <Link to="admin/export-data" className="nav-item">
          <FaFile className="icon" />
          <span>Export Data</span>
        </Link>
        <Link to="admin/addProduct" className="nav-item">
          <FaPlus className="icon" />
          <span>Add Product</span>
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
