import { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaGlobe, FaInstagram, FaPrint, FaReceipt, FaTiktok } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import "./receiptModal.scss";
import type { KaratType } from "../../../types/enums";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { renderLongDescription } from "../../../utils";
import logo from "../../../assets/images/jewelary-logo.svg";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

interface SaleItem {
  productName: string;
  sku: string;
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
                  6885 Ad Astra Blvd NW Edmonton, Alberta
                </div>
                <div className="receipt-subtitle">Phone: (780) 934-1455</div>
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
                      <th style={{ width: "20%" }}>SKU</th>
                      <th style={{ width: "12%" }}>Karat</th>
                      <th style={{ width: "12%" }}>Quantity</th>
                      <th style={{ width: "12%" }}>Weight</th>
                      <th style={{ width: "12%" }}>Price/Gram</th>
                      <th style={{ width: "12%" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-scrollable">
                    {saleDetails.saleItems?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "20%" }}>
                          {renderLongDescription(item.productName)}
                        </td>
                        <td style={{ width: "20%" }}>{item.sku}</td>
                        <td style={{ width: "12%" }}>{item.karat}</td>
                        <td style={{ width: "12%" }}>{item.quantity}</td>
                        <td style={{ width: "12%" }}>{item.weight}g</td>
                        <td style={{ width: "12%" }}>${item.pricePerGram}</td>
                        <td style={{ width: "12%" }}>${item.subtotal}</td>
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

              <div className="receipt-footer">
                <div className="social-links">
                  <Link to="https://adijewelry.ca/" target="_blank">
                    <div className="social-item">
                      <FaGlobe className="globe-icon" />
                      <span>adijewelry.ca</span>
                    </div>
                  </Link>

                  <Link
                    to="https://www.instagram.com/adijewelry.ca?igsh=MTlzaTQ3Z2l0a3Axcw=="
                    target="_blank"
                  >
                    <div className="social-item">
                      <FaInstagram className="instagram-icon" />
                      <span>@adijewelry.ca</span>
                    </div>
                  </Link>
                  <Link
                    to="https://www.tiktok.com/@adi_jewellery"
                    target="_blank"
                  >
                    <div className="social-item">
                      <FaTiktok className="tiktok-icon" />
                      <span>@adi_jewellery</span>
                    </div>
                  </Link>
                </div>

                <div className="qr-section">
                  <div className="qr-label">Scan to leave a review</div>
                  <QRCode
                    value="https://share.google/qk8AVqQpSczkKpZmq"
                    size={80}
                    bgColor="#ffffff"
                    fgColor="var(--gold)"
                    style={{ border: "1px solid #eee", padding: "4px" }}
                  />
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
