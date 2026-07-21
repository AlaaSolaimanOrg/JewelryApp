import dateFormat from "dateformat";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getSalesList } from "../../../../apis/sales.api/sales.api";
import CustomLoader from "../../../../components/CustomLoader/CustomLoader";
import ReceiptModal from "../../../../components/modals/ReceiptModal/ReceiptModal";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../../types/enums";
import {
  getPaymentTag,
  formatCurrency,
  formatDateLabel,
  type Sale,
} from "./RecentTransactions.utils";
import "./recentTransactions.scss";

const RecentTransactions = () => {
  const {
    data: sales,
    pagination,
    isLoading,
  } = useLocalApiSearchSortPagination<Sale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 8,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  return (
    <>
      <div className="dash-section-title">Recent transactions</div>
      <div className="dash-recent-panel">
        <div className="dash-recent-head">
          <span className="dash-recent-title">Last transactions</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="dash-recent-count">
              {pagination.totalRecords ?? 0} transactions
            </span>
            <Link
              to="/transactionHistory"
              className="dash-rr-receipt-btn text-decoration-none"
            >
              View all
            </Link>
          </div>
        </div>
        <Row className="g-2 dash-recent-cols">
          <Col xs={5} md={4}>
            Sale
          </Col>
          <Col xs={3} md={2} style={{ textAlign: "right" }}>
            Amount
          </Col>
          <Col md={2} className="d-none d-md-block" style={{ textAlign: "center" }}>
            Payment
          </Col>
          <Col xs={2} md={2} style={{ textAlign: "center" }}>
            Time
          </Col>
          <Col xs={2} md={2} style={{ textAlign: "right" }}>
            Receipt
          </Col>
        </Row>
        <div className="dash-recent-list">
          {isLoading ? (
            <CustomLoader />
          ) : !pagination.totalRecords ? (
            <div className="dash-empty-row">No results found</div>
          ) : (
            sales?.map((sale) => {
              const tag = getPaymentTag(sale);
              return (
                <Row className="g-2 dash-recent-row" key={sale.id}>
                  <Col xs={5} md={4}>
                    <div className="dash-rr-customer">
                      {sale.customerName || "Walk-in"}
                    </div>
                    <div className="dash-rr-serial">#{sale.serialNumber}</div>
                  </Col>
                  <Col xs={3} md={2} className="dash-rr-amount">
                    {formatCurrency(sale.total)}
                  </Col>
                  <Col md={2} className="dash-rr-method d-none d-md-block">
                    <span className={`dash-rr-method-tag ${tag.className}`}>
                      {tag.label}
                    </span>
                  </Col>
                  <Col xs={2} md={2} className="dash-rr-time">
                    {formatDateLabel(sale.createdDate)}
                    <br />
                    {dateFormat(sale.createdDate, "h:MM TT")}
                  </Col>
                  <Col xs={2} md={2} className="dash-rr-receipt">
                    <ReceiptModal saleId={sale.id}>
                      <button className="dash-rr-receipt-btn">View</button>
                    </ReceiptModal>
                  </Col>
                </Row>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;
