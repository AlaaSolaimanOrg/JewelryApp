import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCustomer } from "../../apis/customers.api/customers.api";
import { checkRequestSucceeded, showError, showSuccess } from "../../utils";
import "./addCustomerModal.scss";

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  show,
  onClose,
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
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 3000);
      });
  };
  const handleSave = () => {
    handleAddCustomer();
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setBirthday("");
    setErrors({});
    onClose();
  };

  return (
    <Modal id="customerModal" show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Customer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="newCustomerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && (
              <div className="error-text">{errors.phoneNumber}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
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
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={handleSave}
          className="modal-save-btn"
          id="saveCustomerBtn"
          disabled={isLoading}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomerModal;
