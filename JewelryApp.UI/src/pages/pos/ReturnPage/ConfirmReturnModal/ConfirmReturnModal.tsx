import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./confirmReturnModal.scss";

type RefundMethod = "Cash" | "Card";

interface ConfirmReturnModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (refundMethod: RefundMethod) => void;
  selectedItemsCount: number;
  totalReturnAmount: number;
}

const ConfirmReturnModal: React.FC<ConfirmReturnModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  selectedItemsCount,
  totalReturnAmount,
}) => {
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("Cash");
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  const handleConfirmClick = () => {
    onConfirm(refundMethod);
  };

  return (
    <Modal
      show={isVisible}
      onHide={onClose}
      centered
      size="lg"
      dialogClassName="custom-modal"
      contentClassName="custom-modal-content"
      backdropClassName="custom-modal-backdrop"
    >
      <Modal.Header className="custom-modal-header">
        <Modal.Title className="custom-modal-title">Confirm Return</Modal.Title>
        <button
          type="button"
          className="custom-close-button"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </Modal.Header>

      <Modal.Body className="custom-modal-body">
        <p>Are you sure you want to process this return?</p>
        <div className="return-summary">
          <div className="summary-row">
            <span>Items Returning:</span>
            <span>{selectedItemsCount}</span>
          </div>
          <div className="summary-row">
            <span>Return Amount:</span>
            <span>${totalReturnAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row refund-method-row">
            <span>Refund Method:</span>
            <div className="refund-options">
              <label
                className={`refund-option ${refundMethod === "Cash" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="refundMethod"
                  value="Cash"
                  checked={refundMethod === "Cash"}
                  onChange={() => setRefundMethod("Cash")}
                />
                Cash
              </label>
              <label
                className={`refund-option ${refundMethod === "Card" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="refundMethod"
                  value="Card"
                  checked={refundMethod === "Card"}
                  onChange={() => setRefundMethod("Card")}
                />
                Card
              </label>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="custom-modal-footer">
        <Button className="modal-cancel-btn" onClick={onClose}>
          Cancel
        </Button>
        <Button className="modal-confirm-btn" onClick={handleConfirmClick}>
          Confirm Return
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmReturnModal;
