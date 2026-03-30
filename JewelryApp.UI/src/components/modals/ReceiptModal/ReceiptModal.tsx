import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button, Modal } from "react-bootstrap";
import {
  FaGlobe,
  FaInstagram,
  FaPrint,
  FaReceipt,
  FaTiktok,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { createReceiptPrintJob } from "../../../apis/printJobs.api/printJobs.api";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import ADI_Jewelry_Logo_Horizontal from "../../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import useLocalApi from "../../../hooks/useLocalApi";
import type { KaratType } from "../../../types/enums";
import { renderLongDescription } from "../../../utils";
import "./receiptModal.scss";

interface Sale {
  id: string;
  serialNumber: string;
  createdDate: string;
  staffName: string;
  customerName: string;
  total: number;
  cashAmount: number;
  cardAmount: number;
  tax: number;
  discount: number;
  saleItems: SaleItem[];
  totalReturnAmount: string;
}

interface SaleItem {
  productName: string;
  sku: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotalAfterDiscount: number;
  subtotalBeforeDiscount: number;
  quantity: number;
  quantityReturned: number;
  amountReturned: number;
}
interface ReceiptModalProps {
  saleId: string;
  children: React.ReactNode;
}

const RECEIPT_PRINT_CSS = `
  * { box-sizing: border-box; }
  @page { size: 80mm auto; margin: 0; }
  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #000;
    font-family: "Segoe UI", Arial, sans-serif;
    line-height: 1.4;
    min-width: auto;
    min-height: auto;
  }
  body {
    display: block;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .receipt-container {
    width: 100%;
    max-width: 576px;
    margin: 0 auto;
    padding: 30px 15px;
    background: #fff;
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    border: 2px solid #dee2e6;
    border-radius: 12px;
    box-shadow: none;
    text-shadow: none;
  }
  .receipt-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #d4af37;
  }
  .receipt-logo {
    width: 80%;
    max-width: 500px;
    margin: 0 auto 10px;
  }
  .receipt-logo img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  .receipt-subtitle {
    margin-bottom: 5px;
    color: #666;
    font-weight: 400;
  }
  .receipt-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #333333;
  }
  .receipt-details > div > div {
    margin-bottom: 6px;
  }
  .returned-cell {
    text-align: left;
    line-height: 1.5;
  }
  .returned-qty {
    font-size: 12px;
    font-weight: 600;
    color: #b91c1c;
  }
  .returned-amount {
    font-size: 11px;
    color: #991b1b;
  }
  .no-return {
    color: #999;
    font-size: 12px;
  }
  .table-wrapper {
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 12px;
  }
  .receipt-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  .receipt-table thead {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  .receipt-table thead tr {
    background: #f1f5f9;
  }
  .receipt-table tbody,
  .receipt-table .table-body-scrollable {
    display: table-row-group !important;
    max-height: none !important;
    overflow: visible !important;
    width: 100%;
  }
  .receipt-table tr {
    display: table-row;
    width: 100%;
    table-layout: fixed;
  }
  .receipt-table th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    color: #212529;
    border-bottom: 2px solid #e0e0e0;
  }
  .receipt-table td {
    padding: 12px 15px;
    vertical-align: top;
    border-bottom: 1px solid #eee;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .receipt-discount {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    padding-bottom: 0;
    font-size: 16px;
    font-weight: 400;
  }
  .receipt-discount .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ddd;
  }
  .payment-breakdown {
    margin-top: 20px;
  }
  .payment-breakdown h4 {
    margin-bottom: 15px;
    color: #212529;
  }
  .payment-breakdown .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ddd;
  }
  .receipt-totals {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
  .receipt-total {
    background: #f2f2f2;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  .total-label {
    margin-bottom: 10px;
    font-size: 19px;
    color: #555;
  }
  .total-value {
    font-size: 29px;
    font-weight: 700;
    color: #212529;
  }
  .receipt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  .social-links {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .social-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
  }
  .globe-icon,
  .tiktok-icon {
    color: #000;
  }
  .instagram-icon {
    color: #e4405f;
  }
  .social-item svg {
    font-size: 19px;
  }
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .qr-label {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    text-align: center;
  }
  .receipt-container.thermal-print {
    width: 576px;
    max-width: 576px;
    background: #fff !important;
    font-size: 14px;
    font-weight: 600;
    color: #000 !important;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  .receipt-container.thermal-print .social-item,
  .receipt-container.thermal-print .instagram-icon,
  .receipt-container.thermal-print .qr-label {
    color: #000 !important;
  }
  .receipt-container.thermal-print .receipt-details {
    font-weight: 700;
    font-size: 17px;
    color: #000;
  }
  .receipt-container.thermal-print .receipt-subtitle {
    color: #000;
    font-weight: 700;
    opacity: 1 !important;
  }
  .receipt-container.thermal-print .receipt-header,
  .receipt-container.thermal-print .receipt-discount,
  .receipt-container.thermal-print .receipt-footer,
  .receipt-container.thermal-print .payment-breakdown .summary-item {
    border-color: #000;
  }
  .receipt-container.thermal-print .table-wrapper {
    border: none !important;
  }
  .receipt-container.thermal-print .receipt-table {
    width: 100% !important;
    table-layout: fixed !important;
  }
  .receipt-container.thermal-print .receipt-table thead {
    display: table-header-group !important;
  }
  .receipt-container.thermal-print .receipt-table thead tr,
  .receipt-container.thermal-print .receipt-table .table-body-scrollable,
  .receipt-container.thermal-print .receipt-table .table-body-scrollable tr {
    display: table-row-group !important;
  }
  .receipt-container.thermal-print .receipt-table thead tr {
    display: table-row !important;
  }
  .receipt-container.thermal-print .receipt-table th {
    background-color: #fff;
    white-space: nowrap !important;
    word-break: normal;
    overflow-wrap: normal;
  }
  .receipt-container.thermal-print .receipt-table th,
  .receipt-container.thermal-print .receipt-table td {
    font-size: 15px;
    font-weight: 700 !important;
    border-bottom: 1px solid #000 !important;
  }
  .receipt-container.thermal-print .receipt-table td {
    white-space: normal !important;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .receipt-container.thermal-print .receipt-table th:nth-child(2),
  .receipt-container.thermal-print .receipt-table td:nth-child(2) {
    white-space: nowrap !important;
    word-break: normal;
    overflow-wrap: normal;
  }
`;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function convertImageSrcToDataUrl(src: string): Promise<string> {
  if (src.startsWith("data:")) {
    return src;
  }

  const absoluteUrl = new URL(src, window.location.href).href;
  const response = await fetch(absoluteUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image asset: ${response.status}`);
  }

  return blobToDataUrl(await response.blob());
}

async function serializeReceiptHtml(element: HTMLElement): Promise<string> {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  const images = Array.from(clonedElement.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      const src = image.getAttribute("src");

      if (!src) {
        return;
      }

      try {
        image.setAttribute("src", await convertImageSrcToDataUrl(src));
      } catch {
        image.setAttribute("src", new URL(src, window.location.href).href);
      }
    }),
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    ${RECEIPT_PRINT_CSS}
  </style>
</head>
<body>${clonedElement.outerHTML}</body>
</html>`;
}

const ReceiptModal = ({ saleId, children }: ReceiptModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [epsonBusy, setEpsonBusy] = useState(false);
  const [showThermalPrint, setShowThermalPrint] = useState(false);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId },
    extraEffectCheck: !!saleId && !!showModal,
    effectDependency: [saleId, showModal],
  }) as {
    data: Sale;
    fetchData: () => void;
  };

  const onClose = () => {
    setShowModal(false);
  };

  const dateObj = saleDetails ? new Date(saleDetails.createdDate) : new Date();
  const totalBeforeDiscount = saleDetails?.saleItems?.reduce(
    (s, it) => s + (it.subtotalBeforeDiscount ?? 0),
    0,
  );

  const handleEpsonPrintHTML = async () => {
    flushSync(() => setShowThermalPrint(true));
    setEpsonBusy(true);
    try {
      if (!saleDetails || !contentRef.current) {
        return;
      }

      const html = await serializeReceiptHtml(contentRef.current);

      await createReceiptPrintJob({
        storeId: "store-1",
        printerId: "front-desk",
        receiptPayload: { html },
      });

      console.log("✅ Print job queued successfully");
    } catch (e) {
      console.error("❌ Print error:", e);
      console.error(e);
      alert(String(e));
    } finally {
      flushSync(() => setShowThermalPrint(false));
      setEpsonBusy(false);
    }
  };
  return (
    <div>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal
        show={showModal}
        onHide={onClose}
        centered
        size="xl"
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
            <div
              ref={contentRef}
              className={`receipt-container ${showThermalPrint ? "thermal-print" : ""}`}
            >
              {/* Header */}
              <div className="receipt-header">
                <div className="receipt-title">
                  <div className="receipt-logo">
                    <img src={ADI_Jewelry_Logo_Horizontal} alt="Logo" />
                  </div>
                </div>
                <div className="receipt-subtitle">
                  6885 Ad Astra Blvd NW Edmonton, Alberta
                </div>
                <div className="receipt-subtitle">Phone: (780) 934-1455</div>
              </div>
              {/* Details */}
              <div className="receipt-details">
                <div>
                  <div>
                    <strong>Trans ID:</strong>
                    {saleDetails.serialNumber || saleDetails.id}
                  </div>
                  <div>
                    <strong>Date:</strong>
                    {dateObj.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    <strong>Time:</strong>
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
                    <strong>Customer:</strong>
                    {saleDetails.customerName || "Walk-in"}
                  </div>
                  <div>
                    <strong>Payment:</strong>
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
                      <th style={{ width: "16%" }}>Product</th>
                      <th style={{ width: "16%" }}>SKU</th>
                      <th style={{ width: "10%" }}>Karat</th>
                      <th style={{ width: "10%" }}>Qty</th>
                      {!showThermalPrint && (
                        <th style={{ width: "16%" }}>Returned</th>
                      )}
                      <th style={{ width: "13%" }}>Weight</th>
                      <th style={{ width: "13%" }}>Price(g)</th>
                      <th style={{ width: "14%" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-scrollable">
                    {saleDetails.saleItems?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "16%" }}>
                          {renderLongDescription(item.productName)}
                        </td>

                        <td style={{ width: "16%" }}>{item.sku}</td>

                        <td style={{ width: "10%" }}>{item.karat}</td>

                        <td style={{ width: "10%" }}>{item.quantity}</td>

                        {!showThermalPrint && (
                          <td
                            style={{ width: "18%" }}
                            className="returned-cell"
                          >
                            {item.quantityReturned > 0 ||
                            item.amountReturned > 0 ? (
                              <>
                                <div className="returned-qty">
                                  {item.quantityReturned || 0} pcs
                                </div>
                                <div className="returned-amount">
                                  ${item.amountReturned?.toFixed(2) || "0.00"}
                                </div>
                              </>
                            ) : (
                              <span className="no-return">-</span>
                            )}
                          </td>
                        )}

                        <td style={{ width: "12%" }}>{item.weight}g</td>

                        <td style={{ width: "12%" }}>${item.pricePerGram}</td>

                        <td style={{ width: "14%" }}>
                          ${item.subtotalBeforeDiscount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="receipt-discount">
                <div className="summary-item">
                  <span>Total Before Discount:</span>
                  <span>${(totalBeforeDiscount ?? 0).toFixed(2)}</span>
                </div>

                {!!saleDetails.discount && (
                  <div className="summary-item">
                    <span>Discount:</span>
                    <span>${saleDetails.discount}</span>
                  </div>
                )}
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

                {saleDetails.totalReturnAmount &&
                  Number(saleDetails.totalReturnAmount) > 0 && (
                    <div className="summary-item returned-item">
                      <span>Total Returned Amount:</span>
                      <span className="text-danger fw-600">
                        ${saleDetails.totalReturnAmount}
                      </span>
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
                    value="https://share.google/gxvrM3GV4YzjE232x"
                    size={showThermalPrint ? 64 : 80}
                    bgColor="#ffffff"
                    fgColor={showThermalPrint ? "#000000" : "var(--gold)"}
                    style={
                      showThermalPrint
                        ? { display: "block" }
                        : {
                            border: "1px solid #eee",
                            padding: "4px",
                            display: "block",
                          }
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleEpsonPrintHTML}
            disabled={!saleDetails || epsonBusy}
          >
            <FaPrint /> {epsonBusy ? "Printing..." : "Print"}
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
