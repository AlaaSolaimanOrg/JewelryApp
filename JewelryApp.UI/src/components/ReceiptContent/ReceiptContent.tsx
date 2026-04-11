import type React from "react";
import { FaGift, FaGlobe, FaInstagram, FaTiktok } from "react-icons/fa";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import ADI_Jewelry_Logo_Horizontal from "../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import { renderLongDescription } from "../../utils";
import type { KaratType } from "../../types/enums";
import "./receiptContent.scss";

export interface Sale {
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
  totalReturnAmount?: string;
}

export interface SaleItem {
  productName: string;
  sku: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotalAfterDiscount: number;
  subtotalBeforeDiscount: number;
  quantity: number;
  quantityReturned?: number;
  amountReturned?: number;
}

interface ReceiptContentProps {
  saleDetails: Sale;
  contentRef: React.RefObject<HTMLDivElement | null>;
  showThermalPrint: boolean;
  isGiftReceipt: boolean;
  showReturnedColumn?: boolean;
}

const ReceiptContent = ({
  saleDetails,
  contentRef,
  showThermalPrint,
  isGiftReceipt,
  showReturnedColumn = false,
}: ReceiptContentProps) => {
  const dateObj = new Date(saleDetails.createdDate);
  const totalBeforeDiscount = saleDetails.saleItems?.reduce(
    (s, it) => s + (it.subtotalBeforeDiscount ?? 0),
    0,
  );

  const containerClass = [
    "receipt-container",
    showThermalPrint && "thermal-print",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={contentRef} className={containerClass}>
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
        {isGiftReceipt && (
          <div className="gift-badge">
            <FaGift className="gift-icon" />
            <span className="gift-text">Gift Receipt</span>
          </div>
        )}
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
              {showReturnedColumn && !showThermalPrint && (
                <th style={{ width: "16%" }}>Returned</th>
              )}
              <th style={{ width: "13%" }}>Weight</th>
              {!isGiftReceipt && (
                <>
                  <th style={{ width: "13%" }}>Price(g)</th>
                  <th style={{ width: "14%" }}>Subtotal</th>
                </>
              )}
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
                {showReturnedColumn && !showThermalPrint && (
                  <td style={{ width: "18%" }} className="returned-cell">
                    {(item.quantityReturned ?? 0) > 0 ||
                    (item.amountReturned ?? 0) > 0 ? (
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
                {!isGiftReceipt && (
                  <>
                    <td style={{ width: "12%" }}>${item.pricePerGram}</td>
                    <td style={{ width: "14%" }}>
                      ${item.subtotalBeforeDiscount}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(saleDetails.discount ?? 0) > 0 && (
        <div className="receipt-discount">
          <div className="summary-item">
            <span>Total Before Discount:</span>
            <span>${(totalBeforeDiscount ?? 0).toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Discount:</span>
            <span>${saleDetails.discount}</span>
          </div>
        </div>
      )}

      {/* Payment Breakdown */}
      {!isGiftReceipt && (
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
      )}

      {/* Totals */}
      {!isGiftReceipt && (
        <div className="receipt-totals">
          <div className="receipt-total">
            <div className="total-label">Total (incl. 5% GST)</div>
            <div className="total-value">${saleDetails.total}</div>
          </div>
        </div>
      )}

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
          <Link to="https://www.tiktok.com/@adi_jewellery" target="_blank">
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
  );
};

export default ReceiptContent;
