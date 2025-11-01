import { FaCashRegister, FaPlusCircle } from "react-icons/fa";
import { RiHistoryFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { getSalesList } from "../../../apis/sales.api/sales.api";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import ReceiptModal from "../../../components/modals/ReceiptModal/ReceiptModal";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../types/enums";
import "./home.scss";

export interface Sale {
  id: string;
  serialNumber: number;
  createdDate: string;
  total: number;
  cardPayment: boolean;
  cashPayment: boolean;
}

const Home = () => {
  const {
    data: sales,
    pagination,
    isLoading: isLoading,
  } = useLocalApiSearchSortPagination<Sale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 4,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  return (
    <div className="page-content active">
      <div className="home-container">
        <div className="home-icon">
          <FaCashRegister />
        </div>
        <h1 className="home-title">Adi Jewelry Point of Sale</h1>
        <p className="home-subtitle">
          Efficiently manage your jewelry store sales with our specialized POS
          system. Scan gold items, calculate prices by weight, and process
          payments seamlessly.
        </p>
        <Link to={"/sale"} className="text-decoration-none">
          <button className="btn btn-primary btn-lg">
            <FaPlusCircle /> Start New Sale
          </button>
        </Link>

        <div className="recent-transactions">
          <div className="recent-header">
            <h3>Recent Transactions</h3>
            <Link to={"/transactionHistory"} className="text-decoration-none">
              <button className="btn btn-secondary">
                <RiHistoryFill />
                View All
              </button>
            </Link>
          </div>
          {isLoading ? (
            <CustomLoader />
          ) : (
            <>
              {pagination.totalRecords ? (
                <ul className="transaction-list">
                  {sales?.map((sale) => {
                    return (
                      <li className="transaction-item">
                        <span className="transaction-id">
                          {sale.serialNumber}
                        </span>
                        <span className="transaction-amount">
                          {sale.total}$
                        </span>
                        <ReceiptModal saleId={sale.id}>
                          <button className="view-receipt-btn">
                            View Receipt
                          </button>
                        </ReceiptModal>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="noResultsFound">
                  <li>No results found</li>
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
