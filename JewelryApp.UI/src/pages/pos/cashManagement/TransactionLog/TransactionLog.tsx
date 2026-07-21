import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  formatCurrency,
  formatLogDate,
  type CashBox,
  type EntryDirection,
  type LogEntry,
} from "../CashManagement.utils";
import "./transactionLog.scss";

interface TransactionLogProps {
  log: LogEntry[];
  onCorrect: (id: number) => void;
  onVoid: (id: number) => void;
}

const TransactionLog = ({ log, onCorrect, onVoid }: TransactionLogProps) => {
  const [search, setSearch] = useState("");
  const [boxFilter, setBoxFilter] = useState<CashBox | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EntryDirection | "all">("all");

  const query = search.trim().toLowerCase();
  const filtered = log.filter((l) => {
    if (boxFilter !== "all" && l.box !== boxFilter) return false;
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (
      query &&
      !l.desc.toLowerCase().includes(query) &&
      !l.notes.toLowerCase().includes(query) &&
      !l.cat.toLowerCase().includes(query)
    )
      return false;
    return true;
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="log-filter"
            value={boxFilter}
            onChange={(e) => setBoxFilter(e.target.value as CashBox | "all")}
          >
            <option value="all">All boxes</option>
            <option value="store">Store box</option>
            <option value="transfer">Transfers box</option>
          </select>
          <select
            className="log-filter"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as EntryDirection | "all")
            }
          >
            <option value="all">All types</option>
            <option value="in">Cash in</option>
            <option value="out">Cash out</option>
          </select>
        </div>
      </div>

      <Row className="g-2 log-cols">
        <Col xs={2} md={1}>
          Date
        </Col>
        <Col xs={4} md={4}>
          Description
        </Col>
        <Col xs={2} md={2}>
          Box
        </Col>
        <Col xs={2} md={2} style={{ textAlign: "right" }}>
          Amount
        </Col>
        <Col md={1} className="d-none d-md-block" style={{ textAlign: "right" }}>
          Balance
        </Col>
        <Col xs={2} md={2} />
      </Row>

      <div className="log-body">
        {!filtered.length ? (
          <div className="log-empty">No transactions found</div>
        ) : (
          filtered.map((l) => {
            const rowClasses = ["log-row"];
            if (l.voided) rowClasses.push("voided");
            if (l.entryType === "correction") rowClasses.push("is-correction");
            if (l.entryType === "void-reversal")
              rowClasses.push("is-void-entry");

            const showActions =
              !l.voided && l.entryType === "normal" && !l.source;

            return (
              <Row className={`g-2 ${rowClasses.join(" ")}`} key={l.id}>
                <Col xs={2} md={1} className="log-date">
                  {formatLogDate(l.date)}
                </Col>
                <Col xs={4} md={4}>
                  <div className="log-desc">
                    {l.desc}
                    {l.voided && <span className="voided-tag">VOIDED</span>}
                  </div>
                  {l.notes && <div className="log-desc-sub">{l.notes}</div>}
                </Col>
                <Col xs={2} md={2}>
                  <span
                    className={`log-box-tag ${
                      l.box === "store" ? "log-box-store" : "log-box-transfer"
                    }`}
                  >
                    {l.box === "store" ? "Store" : "Transfers"}
                  </span>
                </Col>
                <Col
                  xs={2}
                  md={2}
                  className={`log-amount ${l.type === "in" ? "in" : "out"}`}
                >
                  {l.type === "in" ? "+" : "-"}
                  {formatCurrency(l.amount)}
                </Col>
                <Col md={1} className="d-none d-md-block log-balance">
                  {l.cat}
                </Col>
                <Col xs={2} md={2} className="log-actions">
                  {showActions &&
                    (l.moveGroup !== undefined ? (
                      <button
                        className="log-act act-void"
                        onClick={() => onVoid(l.id)}
                      >
                        Void move
                      </button>
                    ) : (
                      <>
                        <button
                          className="log-act act-correct"
                          onClick={() => onCorrect(l.id)}
                        >
                          Correct
                        </button>
                        <button
                          className="log-act act-void"
                          onClick={() => onVoid(l.id)}
                        >
                          Void
                        </button>
                      </>
                    ))}
                </Col>
              </Row>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionLog;
