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
  fullName: "",
  userName: "",
  email: "",
  password: "",
  phoneNumber: "", // Added phone number field
  roles: [] as string[],
  isActive: true,
};

const AddEditStaff = ({ isEdit }: { isEdit: boolean }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [staffFields, setStaffFields] = useState(staffFieldsInitialState);

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
        phoneNumber: staff.phoneNumber || "", // Added phone number field
        roles: staff.roles || [],
        isActive: staff.isActive ?? true,
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
          if (!isEdit) {
            handleCancel();
          } else {
            navigate("/admin/staff");
          }
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

    // Added phone number validation (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; // Basic international phone number validation
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
                <label className="form-label required">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={staffFields.fullName}
                  maxLength={50}
                  onChange={(e) =>
                    handleFieldChange("fullName", e.target.value)
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={staffFields.userName}
                  maxLength={50}
                  onChange={(e) =>
                    handleFieldChange("userName", e.target.value?.trim())
                  }
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={staffFields.email}
                  maxLength={100}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={staffFields.phoneNumber}
                  maxLength={20}
                  onChange={(e) =>
                    handleFieldChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
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
                    maxLength={50}
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
