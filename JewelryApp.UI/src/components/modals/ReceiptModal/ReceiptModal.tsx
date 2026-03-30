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
import ADI_Jewelry_Logo_Horizontal_Black from "../../../assets/images/Adi_Jewelry_Logo_Black.png";
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

function applyComputedStyles(
  sourceElement: Element,
  targetElement: Element,
): void {
  const computedStyle = window.getComputedStyle(sourceElement);
  const targetHtmlElement = targetElement as HTMLElement;

  for (const propertyName of Array.from(computedStyle)) {
    targetHtmlElement.style.setProperty(
      propertyName,
      computedStyle.getPropertyValue(propertyName),
      computedStyle.getPropertyPriority(propertyName),
    );
  }

  
  const sourceChildren = Array.from(sourceElement.children);
  const targetChildren = Array.from(targetElement.children);

  for (let index = 0; index < sourceChildren.length; index += 1) {
    const sourceChild = sourceChildren[index];
    const targetChild = targetChildren[index];

    if (!sourceChild || !targetChild) {
      continue;
    }

    applyComputedStyles(sourceChild, targetChild);
  }
}

function getDataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function inlineImageSources(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      const src = image.getAttribute("src");

      if (!src || src.startsWith("data:")) {
        return;
      }

      try {
        const absoluteUrl = new URL(src, window.location.href).href;
        const response = await fetch(absoluteUrl);

        if (!response.ok) {
          return;
        }

        const dataUrl = await getDataUrlFromBlob(await response.blob());
        image.setAttribute("src", dataUrl);
      } catch {
        image.setAttribute("src", new URL(src, window.location.href).href);
      }
    }),
  );
}

async function serializeReceiptHtml(element: HTMLElement): Promise<string> {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  applyComputedStyles(element, clonedElement);
  await inlineImageSources(clonedElement);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fff; }
    a { color: inherit; text-decoration: none; }
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
                    <img
                      src={
                        showThermalPrint
                          ? ADI_Jewelry_Logo_Horizontal_Black
                          : ADI_Jewelry_Logo_Horizontal
                      }
                      alt="Logo"
                    />
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
