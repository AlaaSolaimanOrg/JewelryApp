import { Link, useParams } from "react-router-dom";
import "./receipt.scss";
import { FaCheck, FaPrint, FaReceipt, FaSms } from "react-icons/fa";
import type { KaratType } from "../../../types/enums";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface SaleItem {
  productName: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotal: number;
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
  tax: number;
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

  const subtotal =
    saleDetails.saleItems?.reduce((acc, item) => acc + item.subtotal, 0) || 0;
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
          <div className="receipt-title">GoldCraft Jewelers</div>
          <div className="receipt-subtitle">
            123 Luxury Avenue, Diamond District
          </div>
          <div className="receipt-subtitle">Phone: (555) 123-4567</div>
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
              <th>Karat</th>
              <th>Weight (g)</th>
              <th>Price/Gram</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {saleDetails.saleItems?.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.karat}</td>
                <td>{item.weight}g</td>
                <td>${item.pricePerGram}</td>
                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

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

          <div className="summary-item">
            <span>Discount:</span>
            <span>${saleDetails.discount}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>${saleDetails.tax}</span>
          </div>
        </div>

        <div className="receipt-totals">
          <div className="receipt-total">
            <div className="total-label">Subtotal</div>
            <div className="total-value">${subtotal}</div>
          </div>
          <div className="receipt-total">
            <div className="total-label">Total</div>
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
      </div>
    </div>
  );
};

export default Receipt;
