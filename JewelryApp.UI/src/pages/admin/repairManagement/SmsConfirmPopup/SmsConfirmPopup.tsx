import React, { useState } from "react";
import { FaCheckCircle, FaCommentDots } from "react-icons/fa";
import "./smsConfirmPopup.scss";

interface SmsConfirmPopupProps {
  onConfirm: (sendSms: boolean) => void;
  onCancel: () => void;
}

const SmsConfirmPopup: React.FC<SmsConfirmPopupProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [sendSms, setSendSms] = useState(false);

  return (
    <div className="sms-popup-overlay" onClick={onCancel}>
      <div className="sms-popup" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="sms-popup__header">
          <div className="sms-popup__icon">
            <FaCheckCircle />
          </div>
          <div>
            <h3 className="sms-popup__title">Mark as Completed</h3>
            <p className="sms-popup__subtitle">
              This repair will be marked as completed
            </p>
          </div>
        </div>

        <div className="sms-popup__divider" />

        {/* SMS TOGGLE */}
        <div
          className={`sms-popup__toggle-row ${sendSms ? "active" : ""}`}
          onClick={() => setSendSms((v) => !v)}
        >
          <div className="sms-popup__toggle-info">
            <FaCommentDots className="sms-popup__toggle-icon" />
            <div className="sms-popup__toggle-text">
              <span className="sms-popup__toggle-label">
                Notify customer via SMS
              </span>
              <span className="sms-popup__toggle-hint">
                Send an SMS to let the customer know their repair is ready
              </span>
            </div>
          </div>
          <div className={`sms-popup__switch ${sendSms ? "on" : ""}`}>
            <div className="sms-popup__switch-thumb" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="sms-popup__actions">
          <button
            className="sms-popup__btn sms-popup__btn--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="sms-popup__btn sms-popup__btn--confirm"
            onClick={() => onConfirm(sendSms)}
          >
            <FaCheckCircle />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsConfirmPopup;
