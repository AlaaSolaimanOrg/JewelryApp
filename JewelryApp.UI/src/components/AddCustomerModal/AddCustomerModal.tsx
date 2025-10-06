import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./addCustomerModal.scss";

interface AddCustomerModalProps {
  show: boolean;
  onClose: () => void;
  onSave?: (customer: {
    name: string;
    email: string;
    phone: string;
    birthday: string;
  }) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  show,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSave = () => {
    if (onSave) {
      onSave({ name, email, phone, birthday });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal id="customerModal" show={show} onHide={onClose} centered>
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
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newCustomerBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
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
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomerModal;
