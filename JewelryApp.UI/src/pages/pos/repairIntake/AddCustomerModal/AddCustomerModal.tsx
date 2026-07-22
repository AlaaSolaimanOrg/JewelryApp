import { useEffect, useState } from "react";
import {
  createCustomer,
  getCustomers,
} from "../../../../apis/customers.api/customers.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../../../utils";
import type { Customer } from "../../posSale/types";
import "./addCustomerModal.scss";

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
  onAdded: (customer: Customer) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddCustomerModal = ({ show, onClose, onAdded }: AddCustomerModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setName("");
      setPhone("");
      setEmail("");
      setBirthday("");
    }
  }, [show]);

  const validate = () => {
    const trimmedName = name.trim();
    const digits = phone.replace(/\D/g, "");

    if (!trimmedName || trimmedName.length < 2) {
      showError("Name must be at least 2 characters");
      return false;
    }
    if (digits.length !== 10) {
      showError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (email && !EMAIL_REGEX.test(email)) {
      showError("Please enter a valid email address");
      return false;
    }
    if (birthday && new Date(birthday) > new Date()) {
      showError("Birthday cannot be in the future");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const digits = phone.replace(/\D/g, "");
    const payload = {
      name: name.trim(),
      email,
      phoneNumber: digits,
      birthday: birthday || null,
    };

    setIsSaving(true);
    try {
      const response = await createCustomer(payload);

      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message);
        onAdded({ id: response.data, ...payload } as unknown as Customer);
        onClose();
        return;
      }

      const message = (response?.message || "").toLowerCase();
      const isDuplicatePhone =
        response.statusCode === 409 ||
        message.includes("exist") ||
        message.includes("duplicate") ||
        message.includes("phone") ||
        message.includes("already");

      if (isDuplicatePhone) {
        const searchResponse = await getCustomers({
          searchBy: digits,
          pageSize: 1,
          pageNumber: 1,
        });
        const existing = searchResponse?.data?.[0];
        if (existing) {
          showSuccess(
            `Customer "${existing.name}" already exists and has been selected.`,
          );
          onAdded(existing);
          onClose();
          return;
        }
      }

      showError(response.message);
    } catch (err) {
      showError("Failed to create customer");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`ri-mo ${show ? "show" : ""}`}>
      <div className="ri-modal">
        <div className="ri-mh">
          <span className="ri-mh-title">Add new customer</span>
          <button className="ri-mh-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ri-mb">
          <div className="ri-fg">
            <label>Customer name *</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="ri-fg">
            <label>Phone number *</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="ri-fg">
            <label>Email</label>
            <input
              type="email"
              placeholder="Optional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="ri-fg">
            <label>Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className="ri-m-btns">
            <button
              className="ri-btn ri-btn-gold"
              onClick={handleSave}
              disabled={isSaving}
            >
              Save customer
            </button>
            <button className="ri-btn ri-btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
