import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCustomer, updateCustomer } from "../../apis/customers.api/customers.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../utils";
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
  setCustomerSearchValue?: (v: string) => void;
  isCustomersView?: boolean;
  mode?: "add" | "edit" | "view";
  customerData?: Customer | null;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  show,
  onClose,
  callGetCustomerDetails,
  setSearchInput,
  setCustomerSearchValue,
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

  // Reset form when modal opens/closes or mode/customerData changes
  useEffect(() => {
    if (show) {
      if (mode === "edit" || mode === "view") {
        // Populate form with existing customer data
        setName(customerData?.name || "");
        setEmail(customerData?.email || "");
        setPhoneNumber(customerData?.phoneNumber || "");
        setBirthday(customerData?.birthday || "");
      } else {
        // Reset form for add mode
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
      // simple email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        newErrors.email = "Please enter a valid email address.";
    }

    if (phoneNumber) {
      // allow digits, spaces, dashes, parentheses, plus sign
      const phoneRegex = /^[0-9()+\-\s]{6,20}$/;
      if (!phoneRegex.test(phoneNumber))
        newErrors.phoneNumber = "Please enter a valid phone number.";
    }

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
      birthday: birthday,
    };

    createCustomer(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          handleSuccess();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        showError("Failed to create customer");
        throw e;
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 3000);
      });
  };

  const handleUpdateCustomer = () => {
    if (!validate() || !customerData?.id) return;

    setIsLoading(true);

    const payload = {
      id: customerData.id,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      birthday: birthday,
    };

    updateCustomer(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message || "Customer updated successfully");
          handleSuccess();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        showError("Failed to update customer");
        throw e;
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 3000);
      });
  };

  const handleSuccess = () => {
    if (isCustomersView && !!callGetCustomerDetails) {
      callGetCustomerDetails();
    }
    if (!isCustomersView && !!setSearchInput && !!callGetCustomerDetails) {
      setCustomerSearchValue?.(name);
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

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Customer";
      case "edit":
        return "Edit Customer";
      case "view":
        return "View Customer";
      default:
        return "Add New Customer";
    }
  };

  const isViewMode = mode === "view";

  return (
    <Modal id="customerModal" show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="customerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="customerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              readOnly={isViewMode}
            />
            {errors.phoneNumber && (
              <div className="error-text">{errors.phoneNumber}</div>
            )}
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
            {mode === "add" ? "Save" : "Update"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomerModal;