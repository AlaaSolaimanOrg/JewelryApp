import { Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { getSalesList } from "../../../../apis/sales.api/sales.api";
import CustomLoader from "../../../../components/CustomLoader/CustomLoader";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../../types/enums";
import {
  getPaymentTag,
  formatCurrency,
  formatLogDate,
  type Sale,
} from "./TransactionLogs.utils";
import "./transactionLogs.scss";

const TransactionLogs = () => {
  const {
    data: sales,
    isLoading,
    onSearchChange,
  } = useLocalApiSearchSortPagination<Sale>({
    apiToCall: (data) => getSalesList(data.payload),
    extraPayload: {},
    initialPageSize: 100,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  return (
    <div className="log-panel">
      <div className="log-head">
        <span className="log-title">Transaction log</span>
        <div className="log-controls">
          <div className="log-search-wrap">
            <FaSearch className="log-search-ico" />
            <input
              type="text"
              className="log-search"
              placeholder="Search..."
              autoComplete="off"
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>

      <Row className="g-2 log-cols">
        <Col xs={3} md={2}>
          Date
        </Col>
        <Col xs={5} md={5}>
          Description
        </Col>
        <Col md={2} className="d-none d-md-block" style={{ textAlign: "center" }}>
          Payment
        </Col>
        <Col xs={4} md={3} style={{ textAlign: "right" }}>
          Amount
        </Col>
      </Row>

      <div className="log-body">
        {isLoading ? (
          <CustomLoader size="compact" text="Loading transactions..." height={200} />
        ) : !sales?.length ? (
          <div className="log-empty">No transactions found</div>
        ) : (
          sales.map((sale) => {
            const tag = getPaymentTag(sale);
            return (
              <Row className="g-2 log-row" key={sale.id}>
                <Col xs={3} md={2} className="log-date">
                  {formatLogDate(sale.createdDate)}
                </Col>
                <Col xs={5} md={5}>
                  <div className="log-desc">Sale #{sale.serialNumber}</div>
                  <div className="log-desc-sub">
                    {sale.customerName || "Walk-in"}
                  </div>
                </Col>
                <Col
                  md={2}
                  className="d-none d-md-block"
                  style={{ textAlign: "center" }}
                >
                  <span className={`log-tag ${tag.className}`}>{tag.label}</span>
                </Col>
                <Col xs={4} md={3} className="log-amount in">
                  +{formatCurrency(sale.total)}
                </Col>
              </Row>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionLogs;
