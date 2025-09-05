import { FaHome, FaSearch } from "react-icons/fa";
import "./adminHeader.scss";

const AdminHeader = () => {
  return (
    <header className="adminHeader">
      <div className="breadcrumb">
        <h2 className="page-title" id="current-page-title">
          <FaHome className="icon"/>
          <span>Admin Dashboard</span>
        </h2>
      </div>
      <div className="header-actions">
        <div className="search-bar">
          <FaSearch className="icon"/>
          <input
            type="text"
            id="global-search"
            placeholder="Search inventory..."
          />
        </div>
        <div className="user-profile">
          <div className="user-avatar">AM</div>
          <div className="user-info">
            <div className="user-name">Admin Manager</div>
            <div className="user-role">Store Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
