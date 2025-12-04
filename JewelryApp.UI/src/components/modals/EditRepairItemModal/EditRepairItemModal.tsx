import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { updateRepairItem } from "../../../apis/repairs.api/repairs.api";
import { showError, showSuccess } from "../../../utils";
import "./editRepairItemModal.scss";

interface EditRepairItemModalProps {
  item: {
    id: string;
    cost: number;
    urgentFee: number;
    discount: number;
  };
  onSave?: (updatedItem: {
    id: string;
    cost: number;
    urgentFee: number;
    discount: number;
  }) => void;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

const EditRepairItemModal: React.FC<EditRepairItemModalProps> = ({
  item,
  onSave,
  onRefresh,
  children,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cost: item.cost,
    urgentFee: item.urgentFee,
    discount: item.discount,
  });

  useEffect(() => {
    if (showModal) {
      setFormData({
        cost: item.cost,
        urgentFee: item.urgentFee,
        discount: item.discount,
      });
    }
  }, [showModal]);

  const hasChanges =
    formData.cost !== item.cost ||
    formData.urgentFee !== item.urgentFee ||
    formData.discount !== item.discount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await updateRepairItem({
        repairItemId: item.id,
        cost: formData.cost,
        urgentFee: formData.urgentFee,
        discount: formData.discount,
      });

      if (response.statusCode === 200 || response.success) {
        showSuccess(response.message || "Item updated successfully");
        if (onSave) {
          onSave({
            id: item.id,
            cost: formData.cost,
            urgentFee: formData.urgentFee,
            discount: formData.discount,
          });
        }
        if (onRefresh) {
          onRefresh();
        }
        setShowModal(false);
      } else {
        showError(response.message || "Failed to update item");
      }
    } catch (err) {
      console.error(err);
      showError("Error updating item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cost: item.cost,
      urgentFee: item.urgentFee,
      discount: item.discount,
    });
    setShowModal(false);
  };

  return (
    <>
      {children ? (
        <div onClick={() => setShowModal(true)}>{children}</div>
      ) : (
        <button
          className="btn-edit-icon"
          onClick={() => setShowModal(true)}
          title="Edit item"
        >
          <FaEdit />
        </button>
      )}

      <Modal show={showModal} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Repair Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Enter cost"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Urgent Fee</Form.Label>
              <Form.Control
                type="number"
                name="urgentFee"
                value={formData.urgentFee}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Enter urgent fee"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Enter discount"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRepairItemModal;
