import { FaHome, FaSearch } from "react-icons/fa";
import "./adminHeader.scss";
import { useLocation } from "react-router-dom";
import { TbCirclePlusFilled } from "react-icons/tb";
import type { JSX } from "react";
import { useAuth } from "../../../context/AuthContext";

const AdminHeader = () => {
  const location = useLocation();
  const { userInfo } = useAuth();

  const pathName = location.pathname;

  const headerTitles: { [key: string]: { title: string; icon: JSX.Element } } =
    {
      "/admin/addProduct": {
        title: "Add Product",
        icon: <TbCirclePlusFilled className="icon titleIcon" />,
      },
      "/admin/dashboard": {
        title: "Admin Dashboard",
        icon: <FaHome className="icon titleIcon" />,
      },
    };

  return (
    <header className="adminHeader">
      <div className="breadcrumb">
        <h2 className="page-title mt-3" id="current-page-title">
          {headerTitles[pathName]?.icon}
          <span>{headerTitles[pathName]?.title}</span>
        </h2>
      </div>
      <div className="header-actions">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            id="global-search"
            placeholder="Search inventory..."
          />
        </div>
        <div className="user-profile">
          <div className="user-avatar">AM</div>
          <div className="user-info">
            <div className="user-name">{userInfo?.userName}</div>
            {/* <div className="user-role">Store Admin</div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
