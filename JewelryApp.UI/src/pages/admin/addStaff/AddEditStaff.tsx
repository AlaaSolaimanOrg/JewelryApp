import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaEye, FaEyeSlash, FaSave, FaTimes } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import {
  createUser,
  getAllRoles,
  getUserById,
  updateUser,
} from "../../../apis/users.api/users.api";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import useLocalApi from "../../../hooks/useLocalApi";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./addEditStaff.scss";

const staffFieldsInitialState = {
  fullName: "",
  userName: "",
  email: "",
  password: "",
  phoneNumber: "",
  roles: [] as string[],
  isActive: true,
};

const AddEditStaff = ({ isEdit }: { isEdit: boolean }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [staffFields, setStaffFields] = useState(staffFieldsInitialState);
  const [showPassword, setShowPassword] = useState(false);

  const { data: staff } = useLocalApi({
    apiToCall: (data) => getUserById(data.payload),
    payload: { userId: userId },
    extraEffectCheck: !!userId,
    effectDependency: [userId],
  }) as { data: any };

  const { data: allRoles = [] } = useLocalApi({
    apiToCall: () => getAllRoles(),
    payload: null,
    effectDependency: [],
  }) as { data: string[] };

  useEffect(() => {
    if (isEdit && staff) {
      setStaffFields({
        fullName: staff.fullName || "",
        userName: staff.userName,
        email: staff.email,
        password: "",
        phoneNumber: staff.phoneNumber || "",
        roles: staff.roles || [],
        isActive: staff.isActive ?? true,
      });
    } else if (!isEdit) {
      handleClear();
    }
  }, [staff, isEdit]);

  const handleFieldChange = (field: string, value: any) => {
    setStaffFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setStaffFields(staffFieldsInitialState);
  };

  const callSaveStaff = () => {
    setIsLoading(true);
    const createPayload = {
      fullName: staffFields.fullName,
      userName: staffFields.userName,
      email: staffFields.email,
      password: staffFields.password,
      phoneNumber: staffFields.phoneNumber,
      roles: staffFields.roles,
    };
    const editPayload = {
      userId: userId,
      fullName: staffFields.fullName,
      userName: staffFields.userName,
      email: staffFields.email,
      phoneNumber: staffFields.phoneNumber,
      isActive: staffFields.isActive,
      roles: staffFields.roles,
    };

    const apiToCall = isEdit ? updateUser : createUser;
    apiToCall(isEdit ? editPayload : createPayload)
      .then((response: any) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          handleClear();
        } else {
          showError(response?.message);
        }
      })
      .catch(() => showError("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  const validateFields = () => {
    if (!staffFields.fullName?.trim()) return false;

    if (!staffFields.userName?.trim()) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staffFields.email)) return false;

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (
      !staffFields.phoneNumber?.trim() ||
      !phoneRegex.test(staffFields.phoneNumber.replace(/[\s\-\(\)]/g, ""))
    ) {
      return false;
    }

    if (!isEdit) {
      const password = staffFields.password;
      if (!password || password.length < 6) return false;

      const uppercaseRegex = /[A-Z]/;
      if (!uppercaseRegex.test(password)) return false;

      const nonAlphaNumRegex = /[^a-zA-Z0-9]/;
      if (!nonAlphaNumRegex.test(password)) return false;
    }

    if (!staffFields.roles || staffFields.roles.length === 0) return false;

    return true;
  };

  const toggleRole = (role: string) => {
    if (staffFields.roles.includes(role)) {
      handleFieldChange(
        "roles",
        staffFields.roles.filter((r) => r !== role)
      );
    } else {
      handleFieldChange("roles", [...staffFields.roles, role]);
    }
  };

  const passwordChecks = {
    length: staffFields.password.length >= 6,
    uppercase: /[A-Z]/.test(staffFields.password),
    special: /[^a-zA-Z0-9]/.test(staffFields.password),
  };

  return (
    <div id="add-staff-page" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <TiUserAdd className="icon" />
          {isEdit ? <span>Edit staff member</span> : <span>Add new staff</span>}
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-outline" onClick={handleClear}>
            <FaTimes className="icon" /> Clear
          </button>
          <button
            className="btn-md btn-outline"
            onClick={() => navigate("/admin/staff")}
          >
            <FaArrowLeft className="icon" /> Back to staff
          </button>
          <button
            className="btn-md btn-gold"
            disabled={!validateFields()}
            onClick={callSaveStaff}
          >
            <FaSave className="icon" /> {isEdit ? "Save changes" : "Save staff"}
          </button>
        </div>
      </div>

      <div className="panel">
        <form id="staff-form" className="form-grid">
          <div className="fg">
            <label>
              Full name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={staffFields.fullName}
              maxLength={50}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="fg">
            <label>
              Username <span className="req">*</span>
            </label>
            <input
              type="text"
              value={staffFields.userName}
              maxLength={50}
              onChange={(e) =>
                handleFieldChange("userName", e.target.value.replace(/\s/g, ""))
              }
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="fg">
            <label>
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              value={staffFields.email}
              maxLength={100}
              onChange={(e) =>
                handleFieldChange(
                  "email",
                  e.target.value.replace(/[^\w@.\-+]/g, "")
                )
              }
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="fg">
            <label>
              Phone number <span className="req">*</span>
            </label>
            <input
              type="tel"
              value={staffFields.phoneNumber}
              maxLength={20}
              onChange={(e) =>
                handleFieldChange(
                  "phoneNumber",
                  e.target.value.replace(/[^0-9+\-\s()]/g, "")
                )
              }
              placeholder="Enter phone number"
              required
            />
          </div>

          {!isEdit && (
            <div className="fg span2">
              <label>
                Password <span className="req">*</span>
              </label>
              <div className="pw-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={staffFields.password}
                  maxLength={50}
                  onChange={(e) =>
                    handleFieldChange(
                      "password",
                      e.target.value.replace(/\s/g, "")
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="pw-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="pw-reqs">
                <span className={`pw-req ${passwordChecks.length ? "met" : ""}`}>
                  At least 6 characters
                </span>
                <span
                  className={`pw-req ${passwordChecks.uppercase ? "met" : ""}`}
                >
                  One uppercase letter
                </span>
                <span className={`pw-req ${passwordChecks.special ? "met" : ""}`}>
                  One special character
                </span>
              </div>
            </div>
          )}

          <div className="fg span2">
            <label>
              Roles <span className="req">*</span>
            </label>
            {allRoles.length > 0 ? (
              <div className="role-checks">
                {allRoles.map((role: string) => {
                  const on = staffFields.roles.includes(role);
                  return (
                    <label
                      key={role}
                      className={`role-check ${on ? "on" : ""}`}
                    >
                      <input
                        type="checkbox"
                        value={role}
                        checked={on}
                        onChange={() => toggleRole(role)}
                      />
                      <span className="rc-box">
                        <FaCheck size={10} />
                      </span>
                      <span className="rc-label">{role}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p>Loading roles...</p>
            )}
          </div>

          <div className="fg span2">
            <label>Status</label>
            <div className="toggle-row">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={staffFields.isActive}
                  onChange={(e) =>
                    handleFieldChange("isActive", e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="active-label">
                {staffFields.isActive
                  ? "Active — can log in"
                  : "Inactive — login blocked"}
              </span>
            </div>
          </div>
        </form>
      </div>

      <LoadingScreen isLoading={isLoading} />
    </div>
  );
};

export default AddEditStaff;
