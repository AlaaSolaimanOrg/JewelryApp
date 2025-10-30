import dateFormat from "dateformat";
import { FaHistory, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getSalesList } from "../../../apis/sales.api/sales.api";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import Paginator from "../../../components/Paginator/Paginator";
import ReceiptModal from "../../../components/ReceiptModal/ReceiptModal";
import CustomTable, {
  type TableHeader,
} from "../../../components/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { handleSort } from "../../../utils";
import "./transactionHistory.scss";

export interface Sale {
  id: string;
  serialNumber: number;
  createdDate: string;
  total: number;
  cardPayment: boolean;
  cashPayment: boolean;
}

const TransactionHistory = () => {
  const {
    data: sales,
    isLoading: isLoading,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    sortCriteria,
    pagination,
  } = useLocalApiSearchSortPagination<Sale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 5,
  });

  const headers: TableHeader[] = [
    {
      key: "transactionId",
      label: "Transaction ID",
      width: "150px",
      onHeaderClick: () => {
        handleSort("serialNumber", sortCriteria, onSortChange);
      },
    },
    {
      key: "dateTime",
      label: "Date & Time",
      width: "200px",
      onHeaderClick: () => {
        handleSort("createdDate", sortCriteria, onSortChange);
      },
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      width: "150px",
      onHeaderClick: () => {
        handleSort("total", sortCriteria, onSortChange);
      },
    },
    {
      key: "paymentType",
      label: "Payment Type",
      width: "150px",
    },
    { key: "actions", label: "Actions", width: "150px" },
  ];

  const getPaymentType = (sale: Sale) => {
    if (sale.cardPayment && sale.cashPayment) {
      return "Cash & Card";
    } else if (sale.cardPayment) {
      return "Card";
    } else if (sale.cashPayment) {
      return "Cash";
    }
    return "Unknown";
  };

  const data = sales?.map((sale) => ({
    transactionId: `${sale.serialNumber}`,
    dateTime: dateFormat(sale.createdDate, "mmm d, yyyy, hh:MM TT"),
    totalAmount: `$${sale.total.toFixed(2)}`,
    paymentType: getPaymentType(sale),
    actions: (
      <>
        <ReceiptModal saleId={sale.id}>
          <button className="view-receipt-btn">View Receipt</button>
        </ReceiptModal>
      </>
    ),
  }));

  return (
    <div id="transaction-history-page" className="page-content">
      <h2>
        <FaHistory /> Past Transactions
      </h2>
      <p className="subtitle">View previous sales records</p>

      <div className="search-container" style={{ marginBottom: "25px" }}>
        <div className="search-bar" style={{ width: "300px" }}>
          <FaSearch className="icon me-1" />
          <input
            type="text"
            placeholder="Search transactions..."
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="transactionHistoryCard">
        <div className="transactionHistoryCard-header">
          <h3 className="transactionHistoryCard-title">
            Transaction History ({pagination.totalRecords ?? 0})
          </h3>
        </div>

        <CustomTable data={data} headers={headers} isLoading={isLoading} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <div className="footer-nav">
        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary mt-3">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </Link>
      </div>

      <LoadingScreen isLoading={isLoading} />
    </div>
  );
};

export default TransactionHistory;
