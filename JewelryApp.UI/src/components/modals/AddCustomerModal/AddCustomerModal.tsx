import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
} from "../../../apis/customers.api/customers.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import { formatPhoneDisplay, getCustomerModalTitle } from "./AddCustomerModal.utils";
import "./addCustomerModal.scss";

interface Customer {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
  callGetCustomerDetails?: () => void;
  setSearchInput?: (v: string) => void;
  setCustomer?: any;
  setCustomerInfoActive?: any;
  isCustomersView?: boolean;
  mode?: "add" | "edit" | "view";
  customerData?: Customer | null;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  show,
  onClose,
  callGetCustomerDetails,
  setSearchInput,
  setCustomer,
  setCustomerInfoActive,
  isCustomersView = false,
  mode = "add",
  customerData = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    birthday?: string;
  }>({});

  useEffect(() => {
    if (show) {
      if (mode === "edit" || mode === "view") {
        setName(customerData?.name || "");
        setEmail(customerData?.email || "");
        setPhoneNumber((customerData?.phoneNumber || "").replace(/\D/g, ""));
        setBirthday(customerData?.birthday || "");
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [show, mode, customerData]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setBirthday("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      birthday?: string;
    } = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        newErrors.email = "Please enter a valid email address.";
    }

    const digits = (phoneNumber || "").replace(/\D/g, "");
    if (!digits || digits.length === 0)
      newErrors.phoneNumber = "Phone number is required.";
    else if (digits.length !== 10)
      newErrors.phoneNumber = "Please enter a 10-digit Canadian phone number.";

    if (birthday) {
      const now = new Date();
      const b = new Date(birthday);
      if (isNaN(b.getTime())) newErrors.birthday = "Please enter a valid date.";
      else if (b > now)
        newErrors.birthday = "Birthday cannot be in the future.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomer = () => {
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      birthday: birthday ? birthday : null,
    };

    createCustomer(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          handleSuccess(response.data);
          onClose();
        } else {
          const msg = (response?.message || "").toLowerCase();
          const isDuplicatePhone =
            response.statusCode === 409 ||
            msg.includes("exist") ||
            msg.includes("duplicate") ||
            msg.includes("phone") ||
            msg.includes("already");

          if (isDuplicatePhone && !isCustomersView) {
            getCustomers({ searchBy: phoneNumber, pageSize: 1, pageNumber: 1 })
              .then((searchResponse) => {
                const existing = searchResponse?.data?.[0];
                if (existing) {
                  showSuccess(
                    `Customer "${existing.name}" already exists and has been selected.`,
                  );
                  setCustomer?.(existing);
                  setCustomerInfoActive?.(true);
                  setSearchInput?.(existing.name);
                  onClose();
                } else {
                  showError(response?.message);
                }
              })
              .catch(() => showError(response?.message));
          } else {
            showError(response?.message);
          }
        }
      })
      .catch((e) => {
        showError("Failed to create customer");
        throw e;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateCustomer = () => {
    if (!validate() || !customerData?.id) return;

    setIsLoading(true);

    const payload = {
      id: customerData.id,
      name: name,
      email: email || null,
      phoneNumber: phoneNumber || null,
      birthday: birthday || null,
    };

    updateCustomer(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message || "Customer updated successfully");
          handleSuccess(customerData.id);
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        showError("Failed to update customer");
        throw e;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSuccess = (customerId) => {
    if (isCustomersView && !!callGetCustomerDetails) {
      callGetCustomerDetails();
    }
    if (!isCustomersView && !!setSearchInput && !!callGetCustomerDetails) {
      setCustomer({
        id: customerId,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        birthday: birthday,
      });
      setCustomerInfoActive(true);
      setSearchInput?.(name);
      callGetCustomerDetails();
    }
  };

  const handleSave = () => {
    if (mode === "add") {
      handleAddCustomer();
    } else if (mode === "edit") {
      handleUpdateCustomer();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isViewMode = mode === "view";

  return (
    <Modal id="customerModal" show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{getCustomerModalTitle(mode)}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="customerName">
            <Form.Label>
              Customer name <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerPhone">
            <Form.Label>
              Phone number <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              inputMode="tel"
              maxLength={12}
              placeholder="780-123-1234"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              readOnly={isViewMode}
            />
            {errors.phoneNumber && (
              <div className="error-text">{errors.phoneNumber}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Optional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.birthday && (
              <div className="error-text">{errors.birthday}</div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="modal-cancel-btn"
        >
          {isViewMode ? "Close" : "Cancel"}
        </Button>
        {!isViewMode && (
          <Button
            variant="warning"
            onClick={handleSave}
            className="modal-save-btn"
            id="saveCustomerBtn"
            disabled={isLoading}
          >
            {mode === "add" ? "Save customer" : "Update customer"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomerModal;
