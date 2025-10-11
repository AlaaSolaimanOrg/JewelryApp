import { FaCashRegister, FaPlusCircle } from "react-icons/fa";
import { RiHistoryFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import "./home.scss";
import { getSalesList } from "../../../apis/sales.api/sales.api";

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
    isLoading: isLoadingProducts,
    fetchData: recallGetProducts,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<Sale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 4,
  });

  return (
    <div className="page-content active">
      <div className="home-container">
        <div className="home-icon">
          <FaCashRegister />
        </div>
        <h1 className="home-title">GoldCraft Point of Sale</h1>
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
          <ul className="transaction-list">
            {sales.map((sale) => {
              return (
                <li className="transaction-item">
                  <span className="transaction-id">{sale.serialNumber}</span>
                  <span className="transaction-amount">{sale.total}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
