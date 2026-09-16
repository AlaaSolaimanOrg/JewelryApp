import { Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { getCashTransactions } from "../../../../apis/cashManagement.api";
import CustomLoader from "../../../../components/loaders/CustomLoader/CustomLoader";
import Paginator from "../../../../components/Paginator/Paginator";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { handleSort } from "../../../../utils";
import { CashBoxType, SortDirection } from "../../../../types/enums";
import { useState } from "react";
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
  const [boxFilter, setBoxFilter] = useState<CashBoxType | "">("");

  const {
    data: transactions,
    isLoading,
    onSearchChange,
    onSortChange,
    onPaginationChange,
    onPageSizeChange,
    sortCriteria,
    pagination,
  } = useLocalApiSearchSortPagination<CashTransactionRow>({
    apiToCall: (data) => getCashTransactions(data.payload),
    extraPayload: { boxType: boxFilter || undefined },
    extraEffectDependency: [refreshKey, boxFilter],
    initialPageSize: 10,
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  const handleBoxFilterChange = (value: CashBoxType | "") => {
    setBoxFilter(value);
    onPaginationChange(1);
  };

  const renderSortArrow = (field: string) =>
    sortCriteria.sortBy === field && (
      <span className="log-sort-arrow">
        {sortCriteria.sortDirection === SortDirection.Ascending ? "▲" : "▼"}
      </span>
    );

  return (
    <div className="log-panel">
      <div className="log-head">
        <span className="log-title">Transaction log</span>
        <div className="log-controls">
          <select
            className="log-box-filter"
            value={boxFilter}
            onChange={(e) =>
              handleBoxFilterChange(
                e.target.value ? (Number(e.target.value) as CashBoxType) : "",
              )
            }
          >
            <option value="">All boxes</option>
            <option value={CashBoxType.Store}>Store</option>
            <option value={CashBoxType.Transfers}>Transfers</option>
          </select>
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
        <Col
          xs={3}
          md={2}
          className="log-col-sortable"
          onClick={() => handleSort("createdDate", sortCriteria, onSortChange)}
        >
          Date {renderSortArrow("createdDate")}
        </Col>
        <Col xs={5} md={5}>
          Description
        </Col>
        <Col
          md={2}
          className="d-none d-md-block log-col-sortable"
          style={{ textAlign: "center" }}
          onClick={() => handleSort("boxType", sortCriteria, onSortChange)}
        >
          Box {renderSortArrow("boxType")}
        </Col>
        <Col
          xs={4}
          md={3}
          className="log-col-sortable"
          style={{ textAlign: "right" }}
          onClick={() => handleSort("amount", sortCriteria, onSortChange)}
        >
          Amount {renderSortArrow("amount")}
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

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        maxPages={4}
      />
    </div>
  );
};

export default TransactionLogs;
