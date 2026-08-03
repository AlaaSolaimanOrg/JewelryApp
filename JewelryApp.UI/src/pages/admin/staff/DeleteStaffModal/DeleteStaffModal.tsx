import { softDeleteUser } from "../../../../apis/users.api/users.api";
import {
  checkRequestSucceeded,
  showError,
  showSuccess,
} from "../../../../utils";
import "./deleteStaffModal.scss";
import type { DeleteStaffModalProps } from "./DeleteStaffModal.type";

const DeleteStaffModal = ({
  user,
  onClose,
  onDeleted,
}: DeleteStaffModalProps) => {
  if (!user) return null;

  const handleConfirm = () => {
    const payload = { userId: String(user.id) };
    softDeleteUser(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          onDeleted();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  return (
    <div className="deleteStaffModal mo show" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-title">Remove staff member?</div>
        <div className="mo-text">
          <b>{user.fullName ?? user.userName}</b> ({user.email}) will lose
          access immediately. This cannot be undone — consider deactivating
          instead if they might return.
        </div>
        <div className="mo-btns">
          <button className="btn-md mo-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-md mo-remove" onClick={handleConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
