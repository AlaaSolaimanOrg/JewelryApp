import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { updateRepair } from "../../../apis/repairs.api/repairs.api";
import { showError, showSuccess } from "../../../utils";
import "./editRepairItemModal.scss";

interface EditRepairItemModalProps {
  item: {
    id: string;
    cost: number;
  };
  onSave?: (updatedItem: { id: string; cost: number }) => void;
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
    cost: String(item.cost),
  });

  useEffect(() => {
    if (showModal) {
      setFormData({
        cost: String(item.cost),
      });
    }
  }, [showModal, item.cost]);

  const hasChanges =
    formData.cost !== String(item.cost) && formData.cost.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await updateRepair({
        id: item.id,
        cost: parseFloat(formData.cost) || 0,
      });

      if (response.statusCode === 200 || response.success) {
        showSuccess(response.message || "Item updated successfully");
        if (onSave) {
          onSave({
            id: item.id,
            cost: parseFloat(formData.cost) || 0,
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
      cost: String(item.cost),
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
                onWheel={(e) => e.currentTarget.blur()}
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                  const digits = formData.cost
                    .replace(".", "")
                    .replace("-", "").length;
                  if (!/[^0-9.]/.test(e.key) && digits >= 12)
                    e.preventDefault();
                }}
                step="0.01"
                min="0"
                placeholder="Enter cost"
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
