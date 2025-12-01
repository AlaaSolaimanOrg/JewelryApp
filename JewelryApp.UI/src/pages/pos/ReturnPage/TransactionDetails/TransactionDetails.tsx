import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaDollarSign,
  FaEye,
  FaMoneyBillWave,
  FaPhone,
  FaReceipt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import ReceiptModal from "../../../../components/modals/ReceiptModal/ReceiptModal";
import "./transactionDetails.scss";

interface PaymentMethod {
  type: string;
  amount: number;
}

interface TransactionDetailsProps {
  saleId: string;
  receiptNumber: string;
  status: string;
  date: string;
  time: string;
  employee: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethods: PaymentMethod[];
  onViewDetails: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  saleId,
  receiptNumber,
  date,
  time,
  employee,
  customerName,
  customerPhone,
  totalAmount,
  paymentMethods,
  onViewDetails,
}) => {
  return (
    <section className="transaction-details-section">
      <h2 className="section-title">
        <FaReceipt /> Transaction Details
      </h2>
      <div className="transaction-card active">
        <div className="transaction-header">
          <div className="transaction-id">
            Receipt #: <span>{receiptNumber}</span>
          </div>
        </div>
        <div className="transaction-meta">
          <div className="transaction-date">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
          <div className="transaction-time">
            <FaClock />
            <span>{time}</span>
          </div>
          <div className="transaction-employee">
            <FaUser />
            <span>{employee}</span>
          </div>
        </div>
        <div className="transaction-details">
          <div className="transaction-detail">
            <div className="detail-label">
              <FaUserCircle />
              Customer Name
            </div>
            <div className="detail-value">{customerName}</div>
          </div>
          <div className="transaction-detail">
            <div className="detail-label">
              <FaPhone />
              Customer Phone
            </div>
            <div className="detail-value">{customerPhone}</div>
          </div>
          <div className="transaction-detail">
            <div className="detail-label">
              <FaDollarSign />
              Total Amount
            </div>
            <div className="detail-value">${totalAmount.toFixed(2)}</div>
          </div>
          <div className="transaction-detail">
            <div className="detail-label">
              <FaCreditCard />
              Payment Method
            </div>
            <div className="detail-value">
              {paymentMethods.map((method, index) => (
                <span key={index} className="payment-method">
                  {method.type === "Cash" ? (
                    <FaMoneyBillWave />
                  ) : (
                    <FaCreditCard />
                  )}
                  {method.type}: ${method.amount.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="transaction-actions">
          <ReceiptModal saleId={saleId}>
            <button className="action-btn view-details" onClick={onViewDetails}>
              <FaEye /> View Details
            </button>
          </ReceiptModal>
        </div>
      </div>
    </section>
  );
};

export default TransactionDetails;
