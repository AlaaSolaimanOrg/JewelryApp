import { useRef } from "react";
import {
  FaCheck,
  FaGlobe,
  FaInstagram,
  FaPrint,
  FaReceipt,
  FaTiktok,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import type { KaratType } from "../../../types/enums";
import "./receipt.scss";
import logo from "../../../assets/images/jewelary-logo.svg";
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

const Receipt = () => {
  const { saleId } = useParams();

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
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <div id="receipt-page" className="page-content">
      <h2 className="title">
        <FaReceipt /> Receipt Preview
      </h2>
      <p className="subtitle">Review receipt before finalizing</p>

      <div ref={contentRef} className="receipt-container">
        <div className="receipt-header">
          <div className="receipt-title">
            <img src={logo} alt="Logo" width={36} height={32} />
            <span> Adi Jewelry</span>
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
                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

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

        <div className="receipt-actions">
          <button className="btn btn-primary" onClick={handlePrint}>
            <FaPrint /> Print Receipt
          </button>

          <Link to={"/"} className="text-decoration-none">
            <button className="btn btn-success">
              <FaCheck /> Start New Sale
            </button>
          </Link>
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
              value="https://share.google/qk8AVqQpSczkKpZmq"
              size={80}
              bgColor="#ffffff"
              fgColor="var(--gold)"
              style={{ border: "1px solid #eee", padding: "4px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
