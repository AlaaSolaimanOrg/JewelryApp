import { useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { TbCirclePlusFilled } from "react-icons/tb";
import {
  createUser,
  updateUser,
  getUserById,
  getAllRoles,
} from "../../../apis/users.api/users.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import "./addEditStaff.scss";

const staffFieldsInitialState = {
  userName: "",
  email: "",
  password: "",
  roles: [] as string[],
  isActive: true, // default active
};

const AddEditStaff = ({ isEdit }: { isEdit: boolean }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [staffFields, setStaffFields] = useState(staffFieldsInitialState);

  // Fetch staff by id when editing
  const { data: staff } = useLocalApi({
    apiToCall: (data) => getUserById(data.payload),
    payload: { userId: userId },
    extraEffectCheck: !!userId,
    effectDependency: [userId],
  }) as { data: any };

  // Fetch all roles from API
  const { data: allRoles = [] } = useLocalApi({
    apiToCall: () => getAllRoles(),
    payload: null,
    effectDependency: [], // only once on mount
  }) as { data: string[] };

  useEffect(() => {
    if (isEdit && staff) {
      setStaffFields({
        userName: staff.userName,
        email: staff.email,
        password: "", // don't prefill password
        roles: staff.roles || [],
        isActive: staff.isActive ?? true, // load isActive from API
      });
    } else if (!isEdit) {
      handleCancel();
    }
  }, [staff, isEdit]);

  const handleFieldChange = (field: string, value: any) => {
    setStaffFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate("/admin/staff");
    } else {
      setStaffFields(staffFieldsInitialState);
    }
  };

  const callSaveStaff = () => {
    setIsLoading(true);
    const createPayload = {
      userName: staffFields.userName,
      email: staffFields.email,
      password: staffFields.password,
      roles: staffFields.roles,
    };
    const editPayload = {
      userId: userId,
      userName: staffFields.userName,
      email: staffFields.email,
      isActive: staffFields.isActive,
      roles: staffFields.roles,
    };

    const apiToCall = isEdit ? updateUser : createUser;
    apiToCall(isEdit ? editPayload : createPayload)
      .then((response: any) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          if (!isEdit) {
            handleCancel();
          } else {
            navigate("/admin/staff"); // go back to staff list
          }
        } else {
          showError(response?.message);
        }
      })
      .catch(() => showError("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  const checkAnyFieldMissing = Object.entries(staffFields).some(
    ([key, value]) => {
      if (key === "password" && isEdit) return false; // password optional on edit
      if (Array.isArray(value)) return value.length === 0;
      return !value;
    }
  );

  const validateFields = () => {
    // Username
    if (!staffFields.userName?.trim()) return false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staffFields.email)) return false;

    // Password required only when adding
    if (!isEdit) {
      const password = staffFields.password;
      if (!password || password.length < 6) return false;

      // Must contain at least one uppercase letter
      const uppercaseRegex = /[A-Z]/;
      if (!uppercaseRegex.test(password)) return false;

      // Must contain at least one non-alphanumeric character
      const nonAlphaNumRegex = /[^a-zA-Z0-9]/;
      if (!nonAlphaNumRegex.test(password)) return false;
    }

    // Roles must not be empty
    if (!staffFields.roles || staffFields.roles.length === 0) return false;

    return true;
  };

  return (
    <div id="add-staff-page" className="page">
      <div className="page-header">
        <h1 className="page-title ">
          <TbCirclePlusFilled className="icon" />
          {isEdit ? <span>Edit Staff Member</span> : <span>Add New Staff</span>}
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gray" onClick={handleCancel}>
            <FaTimes className="icon" /> Cancel
          </button>

          <button
            className="btn-md btn-gold"
            disabled={!validateFields()}
            onClick={callSaveStaff}
          >
            <FaSave className="icon" /> Save Staff
          </button>
        </div>
      </div>

      <div className="card">
        <form id="staff-form">
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={staffFields.userName}
                  onChange={(e) =>
                    handleFieldChange("userName", e.target.value)
                  }
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={staffFields.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label required">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={staffFields.password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Roles</label>
                {allRoles.length > 0 ? (
                  <div className="roles-checkboxes">
                    {allRoles.map((role: string) => (
                      <label key={role} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={role}
                          checked={staffFields.roles.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFieldChange("roles", [
                                ...staffFields.roles,
                                role,
                              ]);
                            } else {
                              handleFieldChange(
                                "roles",
                                staffFields.roles.filter((r) => r !== role)
                              );
                            }
                          }}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>Loading roles...</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Active</label>
                <input
                  type="checkbox"
                  checked={staffFields.isActive}
                  onChange={(e) =>
                    handleFieldChange("isActive", e.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <LoadingScreen isLoading={isLoading} />
    </div>
  );
};

export default AddEditStaff;
