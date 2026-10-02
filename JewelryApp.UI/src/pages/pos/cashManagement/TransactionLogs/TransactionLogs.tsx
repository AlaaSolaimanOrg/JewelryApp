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
  getCategoryLabel,
  formatCurrency,
  formatLogDate,
  isSaleCorrectable,
  type CashTransactionRow,
} from "./TransactionLogs.utils";
import "./transactionLogs.scss";

interface TransactionLogsProps {
  refreshKey: number;
  onCorrectSale?: (saleId: string) => void;
}

const TransactionLogs = ({ refreshKey, onCorrectSale }: TransactionLogsProps) => {
  const [boxFilter, setBoxFilter] = useState<CashBoxType | "">("");
  const showActions = !!onCorrectSale;

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

  const cols = {
    date: { xs: 3, md: 2 },
    desc: { xs: showActions ? 4 : 5, md: showActions ? 3 : 4 },
    box: { md: 2 },
    amount: { xs: showActions ? 3 : 4, md: 2 },
    balance: { md: 2 },
    actions: { xs: 2, md: 1 },
  };

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
          {...cols.date}
          className="log-col-sortable"
          onClick={() => handleSort("createdDate", sortCriteria, onSortChange)}
        >
          Date {renderSortArrow("createdDate")}
        </Col>
        <Col {...cols.desc}>Description</Col>
        <Col
          {...cols.box}
          className="d-none d-md-block log-col-sortable log-center"
          onClick={() => handleSort("boxType", sortCriteria, onSortChange)}
        >
          Box {renderSortArrow("boxType")}
        </Col>
        <Col
          {...cols.amount}
          className="log-col-sortable log-right"
          onClick={() => handleSort("amount", sortCriteria, onSortChange)}
        >
          Amount {renderSortArrow("amount")}
        </Col>
        <Col {...cols.balance} className="d-none d-md-block log-right">
          Type
        </Col>
        {showActions && <Col {...cols.actions} />}
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
                <Col {...cols.date} className="log-date">
                  {formatLogDate(row.createdDate)}
                </Col>
                <Col {...cols.desc}>
                  <div className="log-desc">{desc.title}</div>
                  {desc.sub && <div className="log-desc-sub">{desc.sub}</div>}
                  {row.createdByName && (
                    <div className="log-desc-user">by {row.createdByName}</div>
                  )}
                </Col>
                <Col {...cols.box} className="d-none d-md-block log-center">
                  <span className={`log-tag ${tag.className}`}>{tag.label}</span>
                </Col>
                <Col
                  {...cols.amount}
                  className={`log-amount ${row.isCredit ? "in" : "out"}`}
                >
                  {row.isCredit ? "+" : "-"}
                  {formatCurrency(row.amount)}
                </Col>
                <Col {...cols.balance} className="d-none d-md-block log-balance">
                  {getCategoryLabel(row)}
                </Col>
                {showActions && (
                  <Col {...cols.actions} className="log-actions">
                    {isSaleCorrectable(row) && (
                      <button
                        className="log-act"
                        onClick={() => onCorrectSale!(row.saleId!)}
                      >
                        Correct
                      </button>
                    )}
                  </Col>
                )}
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
