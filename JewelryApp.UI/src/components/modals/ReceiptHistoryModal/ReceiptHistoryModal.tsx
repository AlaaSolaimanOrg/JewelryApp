import { FaReceipt, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "./receiptHistoryModal.scss";

import { getCustomerPurhcaseHistory } from "../../../apis/customers.api/customers.api";
import useLocalApi from "../../../hooks/useLocalApi";
import ReceiptModal from "../ReceiptModal/ReceiptModal";

interface PurchaseHistory {
  saleId: string;
  serialNumber: string;
  purchaseDate: string;
  itemCount: number;
  discount: number;
  totalAmount: number;
}

interface ReceiptHistoryModalProps {
  customerId: string;
  customerName: string;
  children: React.ReactNode;
  totalWeight18K: number;
  totalWeight21K: number;
  totalAmount: number;
  totalDiscount: number;
}

const fmtCurrency = (value: number): string =>
  `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (value: string): string => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ReceiptHistoryModal = ({
  customerId,
  customerName,
  children,
  totalWeight18K,
  totalWeight21K,
  totalAmount,
  totalDiscount,
}: ReceiptHistoryModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const { data: customerPurhcaseHistory } = useLocalApi({
    apiToCall: (data) => getCustomerPurhcaseHistory(data.payload),
    payload: { customerId: customerId },
    extraEffectCheck: !!showModal,
    effectDependency: [showModal],
  }) as {
    data: PurchaseHistory[];
    fetchData: () => void;
  };

  const onClose = () => setShowModal(false);

  return (
    <div>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>

      {showModal && (
        <div className="receipt-history-modal mo" onClick={onClose}>
          <div className="mo-box wide" onClick={(e) => e.stopPropagation()}>
            <div className="mo-head">
              <span className="mo-title">
                <FaReceipt /> Purchase history — <span>{customerName}</span>
              </span>
              <button className="mo-x" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="mo-body">
              <div className="hist-totals">
                <div className="ht">
                  <div className="ht-label">Total 18K weight</div>
                  <div className="ht-val">{totalWeight18K.toFixed(2)}g</div>
                </div>
                <div className="ht">
                  <div className="ht-label">Total 21K weight</div>
                  <div className="ht-val">{totalWeight21K.toFixed(2)}g</div>
                </div>
                <div className="ht">
                  <div className="ht-label">Total amount</div>
                  <div className="ht-val amount">
                    {fmtCurrency(totalAmount)}
                  </div>
                </div>
                <div className="ht">
                  <div className="ht-label">Total discount</div>
                  <div
                    className={`ht-val ${totalDiscount > 0 ? "discount" : ""}`}
                  >
                    {fmtCurrency(totalDiscount)}
                  </div>
                </div>
              </div>

              {!customerPurhcaseHistory?.length ? (
                <div className="empty-state">No purchase history found.</div>
              ) : (
                <div className="hist-rows">
                  {customerPurhcaseHistory.map((purchase) => (
                    <div className="ph-row" key={purchase.saleId}>
                      <span className="ph-date">
                        {fmtDate(purchase.purchaseDate)}
                      </span>
                      <span className="ph-items">
                        {purchase.itemCount} item
                        {purchase.itemCount !== 1 ? "s" : ""}
                        {purchase.serialNumber && (
                          <span className="sale-id">
                            {purchase.serialNumber}
                          </span>
                        )}
                      </span>
                      <span className="ph-disc">
                        {purchase.discount > 0
                          ? `-${fmtCurrency(purchase.discount)}`
                          : ""}
                      </span>
                      <span className="ph-amt">
                        {fmtCurrency(purchase.totalAmount)}
                      </span>
                      <ReceiptModal saleId={purchase.saleId}>
                        <button className="ph-btn">View receipt</button>
                      </ReceiptModal>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mo-foot">
              <button className="mo-btn mo-btn-dark" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptHistoryModal;
