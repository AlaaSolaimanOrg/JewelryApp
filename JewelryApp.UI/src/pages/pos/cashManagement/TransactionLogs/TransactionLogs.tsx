import { Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { getCashTransactions } from "../../../../apis/cashManagement.api/cashManagement.api";
import CustomLoader from "../../../../components/loaders/CustomLoader/CustomLoader";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../../types/enums";
import {
  getBoxTag,
  getDescription,
  formatCurrency,
  formatLogDate,
  type CashTransactionRow,
} from "./TransactionLogs.utils";
import "./transactionLogs.scss";

interface TransactionLogsProps {
  refreshKey: number;
}

const TransactionLogs = ({ refreshKey }: TransactionLogsProps) => {
  const {
    data: transactions,
    isLoading,
    onSearchChange,
  } = useLocalApiSearchSortPagination<CashTransactionRow>({
    apiToCall: (data) => getCashTransactions(data.payload),
    extraPayload: {},
    extraEffectDependency: [refreshKey],
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
          Box
        </Col>
        <Col xs={4} md={3} style={{ textAlign: "right" }}>
          Amount
        </Col>
      </Row>

      <div className="log-body">
        {isLoading ? (
          <CustomLoader size="compact" text="Loading transactions..." height={200} />
        ) : !transactions?.length ? (
          <div className="log-empty">No transactions found</div>
        ) : (
          transactions.map((row) => {
            const tag = getBoxTag(row);
            const desc = getDescription(row);
            return (
              <Row className="g-2 log-row" key={row.id}>
                <Col xs={3} md={2} className="log-date">
                  {formatLogDate(row.createdDate)}
                </Col>
                <Col xs={5} md={5}>
                  <div className="log-desc">{desc.title}</div>
                  {desc.sub && <div className="log-desc-sub">{desc.sub}</div>}
                </Col>
                <Col
                  md={2}
                  className="d-none d-md-block"
                  style={{ textAlign: "center" }}
                >
                  <span className={`log-tag ${tag.className}`}>{tag.label}</span>
                </Col>
                <Col
                  xs={4}
                  md={3}
                  className={`log-amount ${row.isCredit ? "in" : "out"}`}
                >
                  {row.isCredit ? "+" : "-"}
                  {formatCurrency(row.amount)}
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
