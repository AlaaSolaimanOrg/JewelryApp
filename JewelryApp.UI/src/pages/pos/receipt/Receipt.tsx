import { useRef, useState } from "react";
import {
  FaCheck,
  FaGlobe,
  FaInstagram,
  FaPrint,
  FaReceipt,
  FaTiktok,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import type { KaratType } from "../../../types/enums";
import "./receipt.scss";
import ADI_Jewelry_Logo_Horizontal from "../../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import QRCode from "react-qr-code";
import { printDomToEpson } from "../../../EpsonDomPrintOptions.ts";
import { Button } from "react-bootstrap";
import ADI_Jewelry_Logo_Horizontal_Black from "../../../assets/images/Adi_Jewelry_Logo_Black.png";

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
}

const Receipt = () => {
  const { saleId } = useParams();
  const [epsonBusy, setEpsonBusy] = useState(false);

  const [showThermalPrint, setShowThermalPrint] = useState(true);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId },
    extraEffectCheck: !!saleId,
    effectDependency: [saleId],
  }) as {
    data: Sale;
    fetchData: () => void;
  };

  if (!saleDetails) {
    return (
      <div id="receipt-page" className="page-content">
        <h2>
          <FaReceipt /> Receipt Preview
        </h2>
        <p>Loading sale details...</p>
      </div>
    );
  }

  const dateObj = new Date(saleDetails.createdDate);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleEpsonPrintHTML = async () => {
    if (!contentRef.current) return;

    setShowThermalPrint(true);
    setEpsonBusy(true);
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(null)),
      );
      await printDomToEpson(contentRef.current, {
        ip: "192.168.0.19",
        port: 8008,
        crypto: false,
        buffer: false,
        paperWidthPx: 576, // 80mm; use 384 for 58mm
        scale: 4,
      });
    } catch (e) {
      console.error(e);
      alert(String(e));
    } finally {
      setShowThermalPrint(false);
      setEpsonBusy(false);
    }
  };
  return (
    <div id="receipt-page" className="page-content">
      <h2 className="title">
        <FaReceipt /> Receipt Preview
      </h2>
      <p className="subtitle">Review receipt before finalizing</p>

      <div
        ref={contentRef}
        id="receipt-container"
        className={showThermalPrint ? "thermal-print" : ""}
      >
        <div className="receipt-header">
          <div className="receipt-title">
            <img
              className="receipt-logo"
              src={
                showThermalPrint
                  ? ADI_Jewelry_Logo_Horizontal_Black
                  : ADI_Jewelry_Logo_Horizontal
              }
              alt="Logo"
            />
          </div>
          <div className="receipt-subtitle">
            6885 Ad Astra Blvd NW Edmonton, Alberta
          </div>
          <div className="receipt-subtitle">Phone: (780) 934-1455</div>
        </div>

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
              <strong>Customer:</strong> {saleDetails.customerName || "Walk-in"}
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
        <div className="table-wrapper">
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sku</th>
                <th>Karat</th>
                <th>Quantity</th>
                <th>Weight (g)</th>
                <th>Price/Gram</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {saleDetails.saleItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.sku}</td>
                  <td>{item.karat}</td>
                  <td>{item.quantity}</td>
                  <td>{item.weight}g</td>
                  <td>${item.pricePerGram}</td>
                  <td>${item.subtotalBeforeDiscount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!!saleDetails.discount && (
          <div className="receipt-discount">
            <span>Discount:</span>
            <span>${saleDetails.discount}</span>
          </div>
        )}

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
        </div>

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
      <div className="receipt-actions">
        {/* <button className="btn btn-primary" onClick={handlePrint}>
            <FaPrint /> Print Receipt
          </button> */}

        <Button
          variant="primary"
          onClick={handleEpsonPrintHTML}
          disabled={!saleDetails || epsonBusy}
        >
          <FaPrint /> {epsonBusy ? "Printing..." : "Print"}
        </Button>

        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary">
            <FaCheck /> Start New Sale
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Receipt;
