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

  return (
    <header className="adminHeader">
      <div className="header-actions">
        <div className="user-profile">
          <div className="user-avatar">AM</div>
          <div className="user-info">
            <div className="user-name">{userInfo?.userName}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
