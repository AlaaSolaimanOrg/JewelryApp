import { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPrint, FaReceipt } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import "./receiptModal.scss";
import type { KaratType } from "../../../types/enums";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { renderLongDescription } from "../../../utils";
import logo from "../../../assets/images/jewelary-logo.svg";

interface SaleItem {
  productName: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotal: number;
  quantity: number;
}

interface Sale {
  id: string;
  serialNumber: number;
  createdDate: string;
  staffName: string;
  customerName: string;
  total: number;
  cashAmount: number;
  cardAmount: number;
  discount: number;
  saleItems: SaleItem[];
}

interface ReceiptModalProps {
  saleId: string;
  children: React.ReactNode;
}

const ReceiptModal = ({ saleId, children }: ReceiptModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId },
    extraEffectCheck: !!saleId && !!showModal,
    effectDependency: [saleId, showModal],
  }) as {
    data: Sale;
    fetchData: () => void;
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Receipt-${
      saleDetails?.serialNumber || saleDetails?.id || ""
    }`,
  });

  const onClose = () => {
    setShowModal(false);
  };

  const subtotal =
    saleDetails?.saleItems?.reduce((acc, item) => acc + item.subtotal, 0) || 0;
  const dateObj = saleDetails ? new Date(saleDetails.createdDate) : new Date();

  return (
    <div>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal
        show={showModal}
        onHide={onClose}
        centered
        size="lg"
        className="receipt-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaReceipt style={{ marginRight: "8px" }} /> Receipt Preview
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!saleDetails ? (
            <div className="text-center py-4">
              <p>Loading sale details...</p>
            </div>
          ) : (
            <div ref={contentRef} className="receipt-container">
              {/* Header */}
              <div className="receipt-header">
                <div className="receipt-title">
                  <img src={logo} alt="Logo" width={36} height={32} />
                  <span> Adi Jewelry</span>
                </div>{" "}
                <div className="receipt-subtitle">
                  123 Luxury Avenue, Diamond District
                </div>
                <div className="receipt-subtitle">Phone: (555) 123-4567</div>
              </div>

              {/* Details */}
              <div className="receipt-details">
                <div>
                  <div>
                    <strong>Transaction ID:</strong>{" "}
                    {saleDetails.serialNumber || saleDetails.id}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {dateObj.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    <strong>Time:</strong>{" "}
                    {dateObj.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
                <div>
                  <div>
                    <strong>Staff:</strong> {saleDetails.staffName || "N/A"}
                  </div>
                  <div>
                    <strong>Customer:</strong>{" "}
                    {saleDetails.customerName || "Walk-in"}
                  </div>
                  <div>
                    <strong>Payment Method:</strong>{" "}
                    {saleDetails.cashAmount && saleDetails.cardAmount
                      ? "Cash & Card"
                      : saleDetails.cashAmount
                      ? "Cash"
                      : saleDetails.cardAmount
                      ? "Card"
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="table-wrapper">
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Product</th>
                      <th>Karat</th>
                      <th>Quantity</th>
                      <th>Weight (g)</th>
                      <th>Price/Gram</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-scrollable">
                    {saleDetails.saleItems?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "20%" }}>
                          {renderLongDescription(item.productName)}
                        </td>
                        <td>{item.karat}</td>
                        <td>{item.quantity}</td>
                        <td>{item.weight}g</td>
                        <td>${item.pricePerGram}</td>
                        <td>${item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Breakdown */}
              <div className="payment-breakdown">
                <h4>Payment Breakdown</h4>

                {saleDetails.cashAmount > 0 && (
                  <div className="summary-item">
                    <span>Cash Payment:</span>
                    <span>${saleDetails.cashAmount}</span>
                  </div>
                )}

                {saleDetails.cardAmount > 0 && (
                  <div className="summary-item">
                    <span>Card Payment:</span>
                    <span>${saleDetails.cardAmount}</span>
                  </div>
                )}

                {!!saleDetails.discount && (
                  <div className="summary-item">
                    <span>Discount:</span>
                    <span>${saleDetails.discount}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="receipt-totals">
                <div className="receipt-total">
                  <div className="total-label">Total (incl. 5% GST)</div>
                  <div className="total-value">${saleDetails.total}</div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={!saleDetails}
          >
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
