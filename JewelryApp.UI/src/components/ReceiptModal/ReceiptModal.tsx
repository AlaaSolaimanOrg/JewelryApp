import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPrint, FaReceipt } from "react-icons/fa";
import "./receiptModal.scss";

const ReceiptModal = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const onClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div
        onClick={() => {
          setShowModal(true);
        }}
      >
        {children}
      </div>
      
      <Modal
        show={showModal}
        onHide={onClose}
        centered
        className="receipt-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaReceipt style={{ marginRight: "8px" }} /> Receipt Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="receipt-container">
            <div className="receipt-header">
              <div className="receipt-title">GoldCraft Jewelers</div>
              <div className="receipt-subtitle">
                123 Luxury Avenue, Diamond District
              </div>
              <div className="receipt-subtitle">Phone: (555) 123-4567</div>
            </div>

            <div className="receipt-details">
              <div>
                <div>
                  <strong>Transaction ID:</strong> TR-2023-0583
                </div>
                <div>
                  <strong>Date:</strong> July 13, 2025
                </div>
                <div>
                  <strong>Time:</strong> 10:45:23 AM
                </div>
              </div>
              <div>
                <div>
                  <strong>Staff:</strong> Sarah Johnson
                </div>
                <div>
                  <strong>Customer:</strong> Walk-in
                </div>
                <div>
                  <strong>Payment Method:</strong> Cash & Card
                </div>
              </div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Karat</th>
                  <th>Weight</th>
                  <th>Price/Gram</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diamond Solitaire Ring</td>
                  <td>21K</td>
                  <td>3.5g</td>
                  <td>$125.75</td>
                  <td>$440.13</td>
                </tr>
                <tr>
                  <td>Gold Tennis Bracelet</td>
                  <td>18K</td>
                  <td>8.2g</td>
                  <td>$112.30</td>
                  <td>$920.86</td>
                </tr>
                <tr>
                  <td>Ruby Heart Pendant</td>
                  <td>24K</td>
                  <td>5.1g</td>
                  <td>$142.90</td>
                  <td>$728.79</td>
                </tr>
              </tbody>
            </table>

            <div className="receipt-totals">
              <div className="receipt-total">
                <div className="total-label">Subtotal</div>
                <div className="total-value">$2,089.78</div>
              </div>
              <div className="receipt-total">
                <div className="total-label">Total</div>
                <div className="total-value">$2,215.17</div>
              </div>
            </div>

            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>
              <div className="summary-item">
                <span>Cash Payment:</span>
                <span>$200.00</span>
              </div>
              <div className="summary-item">
                <span>Card Payment:</span>
                <span>$2,015.17</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
            <FaPrint /> Print Receipt
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceiptModal;
