import { FaReceipt } from "react-icons/fa";
import ReceiptModal from "../../../../components/modals/ReceiptModal/ReceiptModal";
import type { Sale } from "../ReturnPage.type";
import { formatCurrency } from "../ReturnPage.utils";
import "./transactionPanel.scss";

interface TransactionPanelProps {
  sale: Sale;
}

const TransactionPanel = ({ sale }: TransactionPanelProps) => {
  const formattedDate = new Date(sale.createdDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const paidBy =
    sale.cashAmount > 0 && sale.cardAmount > 0
      ? "Cash + Card"
      : sale.cardAmount > 0
        ? "Card"
        : "Cash";

  return (
    <div className="rp-panel rp-txn-panel">
      <div className="rp-panel-label">Transaction · {sale.serialNumber}</div>
      <div className="rp-txn-grid">
        <div>
          <div className="rp-txn-label">Customer</div>
          <div className="rp-txn-val">{sale.customerName}</div>
        </div>
        <div>
          <div className="rp-txn-label">Phone</div>
          <div className="rp-txn-val">{sale.customerPhone}</div>
        </div>
        <div>
          <div className="rp-txn-label">Date</div>
          <div className="rp-txn-val">{formattedDate}</div>
        </div>
        <div>
          <div className="rp-txn-label">Paid by</div>
          <div className="rp-txn-val">{paidBy}</div>
        </div>
      </div>
      <div className="rp-txn-total-row">
        <span className="rp-txn-label">Original total</span>
        <span className="rp-txn-total-val">{formatCurrency(sale.total)}</span>
      </div>
      <ReceiptModal saleId={sale.id}>
        <button className="rp-view-receipt-btn">
          <FaReceipt /> View receipt
        </button>
      </ReceiptModal>
    </div>
  );
};

export default TransactionPanel;
