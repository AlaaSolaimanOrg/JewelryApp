import { useAuth } from "../../../context/AuthContext";
import "./adminHeader.scss";

const AdminHeader = () => {
  const { userInfo } = useAuth();


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
