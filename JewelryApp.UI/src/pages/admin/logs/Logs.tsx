import { useState } from "react";
import { Badge } from "react-bootstrap";
import {
  FaExclamationCircle,
  FaFileAlt,
  FaInfoCircle,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { deleteLogs, getLogs } from "../../../apis/logs.api/logs.api";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import LogDataModal from "../../../components/modals/LogDataModal/LogDataModal";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable, {
  type TableHeader,
} from "../../../components/tables/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { LogLevel, SortDirection } from "../../../types/enums";
import {
  checkRequestSucceeded,
  handleSort,
  showError,
  showSuccess,
} from "../../../utils";
import "./logs.scss";
import TruncatedTextWithCopy from "../../../components/TruncatedTextWithCopy/TruncatedTextWithCopy";

interface LogItem {
  id: string;
  handlerName: string;
  message: string;
  request: string;
  exception: string;
  content: string;
  level: LogLevel;
  loggedInUserId: number;
  userName: string;
  correlationId: string;
  createdAt: string;
}

const Logs = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [logLevelFilter, setLogLevelFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState("");

  const {
    data: logs,
    fetchData: recallGetLogs,
    sortCriteria,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    pagination,
    isLoading,
    setData,
  } = useLocalApiSearchSortPagination<LogItem>({
    apiToCall: (data) => getLogs(data.payload),
    extraPayload: logLevelFilter ? { logLevel: Number(logLevelFilter) } : {},
    extraEffectDependency: [logLevelFilter],
    initialSortBy: "createdAt",
    initialSortDirection: SortDirection.Descending,
    initialPageSize: 10,
  });

  const headers: TableHeader[] = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={
            !!logs && logs.length > 0 && selectedIds.length === logs.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              const ids = logs?.map((l) => l.id).filter(Boolean) || [];
              setSelectedIds(ids);
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      width: "50px",
    },
    {
      key: "createdAt",
      label: "Timestamp",
      width: "200px",
      onHeaderClick: () => handleSort("createdAt", sortCriteria, onSortChange),
    },
    {
      key: "level",
      label: "Level",
      width: "120px",
      onHeaderClick: () => handleSort("level", sortCriteria, onSortChange),
    },
    { key: "handlerName", label: "Handler", width: "200px" },
    { key: "message", label: "Message" },
    { key: "request", label: "request" },
    { key: "exception", label: "Exception" },
    { key: "userName", label: "User", width: "160px" },
    { key: "correlationId", label: "Correlation", width: "180px" },
    { key: "actions", label: "Actions", width: "120px" },
  ];

  const handleDelete = async (idOrIds: string | string[]) => {
    const idsArray = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (!idsArray || idsArray.length === 0) return;

    const confirmed = window.confirm(
      idsArray.length > 1
        ? `Are you sure you want to delete ${idsArray.length} logs?`
        : `Are you sure you want to delete this log?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await deleteLogs({ logIds: idsArray });
      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message || "Deleted successfully");
        // clear selection and refresh
        setSelectedIds((prev) => prev.filter((i) => !idsArray.includes(i)));
        recallGetLogs();
      } else {
        showError(response.message || "Failed to delete logs");
      }
    } catch (err: any) {
      showError(err?.message || "Error deleting logs");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    // delete currently selected ids
    if (!selectedIds || selectedIds.length === 0) {
      window.alert("No logs selected to delete");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteLogs({ logIds: selectedIds });
      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(response.message || "Deleted successfully");
        setSelectedIds([]);
        setData([]);
        recallGetLogs();
      } else {
        showError(response.message || "Failed to delete logs");
      }
    } catch (err: any) {
      showError(err?.message || "Error deleting logs");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderLevelBadge = (level?: LogLevel) => {
    if (level === undefined || level === null)
      return <Badge bg="secondary">-</Badge>;
    const text = LogLevel[level] ?? String(level);
    const variant =
      level === LogLevel.Error
        ? "danger"
        : level === LogLevel.Warning
        ? "warning"
        : "info";
    return <Badge bg={variant}>{text}</Badge>;
  };

  const handleOpenLogModal = (title: string, data: string) => {
    setModalTitle(title);
    setModalData(data);
    setShowLogModal(true);
  };

  const data = logs?.map((log) => ({
    select: (
      <input
        type="checkbox"
        checked={selectedIds.includes(log.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedIds((prev) => Array.from(new Set([...prev, log.id])));
          } else {
            setSelectedIds((prev) => prev.filter((i) => i !== log.id));
          }
        }}
      />
    ),
    createdAt: log?.createdAt ? (
      <TruncatedTextWithCopy text={log.createdAt} maxLength={16} />
    ) : (
      "-"
    ),
    level: renderLevelBadge(log.level),
    handlerName: log.handlerName || "-",
    message:
      log.message || log.content ? (
        <button
          className="icon-btn"
          title="View Message"
          onClick={() =>
            handleOpenLogModal(
              "Message Details",
              log.message || log.content || ""
            )
          }
        >
          <FaInfoCircle />
        </button>
      ) : (
        "-"
      ),
    exception: log.exception ? (
      <button
        className="icon-btn"
        title="View Exception"
        onClick={() => handleOpenLogModal("Exception Details", log.exception)}
      >
        <FaExclamationCircle />
      </button>
    ) : (
      "-"
    ),
    request: log.request ? (
      <button
        className="icon-btn"
        title="View Request"
        onClick={() => {
          let parsed = "";
          try {
            parsed = JSON.stringify(JSON.parse(log.request), null, 2);
          } catch {
            parsed = log.request; // fallback to raw payload
          }
          handleOpenLogModal("Request Details", parsed);
        }}
      >
        <FaFileAlt />
      </button>
    ) : (
      "-"
    ),
    userName: log.userName || "-",
    correlationId: log.correlationId ? (
      <TruncatedTextWithCopy text={log.correlationId} maxLength={12} />
    ) : (
      "-"
    ),
    actions: (
      <div className="action-buttons">
        <button
          className="action-btn danger"
          title="Delete"
          onClick={() => handleDelete(log.id)}
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div id="logs-page" className="page">
      <div className="page-header">
        <div className="page-actions"></div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Application Logs</h3>

          <div className="filters-row">
            <div className="search-bar" style={{ width: "280px" }}>
              <FaSearch className="icon me-1" />
              <input
                type="text"
                placeholder="Search logs..."
                onChange={onSearchChange}
              />
            </div>

            <div className="filter-group">
              <select
                value={logLevelFilter}
                onChange={(e) => setLogLevelFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value={LogLevel.Info}>{LogLevel[LogLevel.Info]}</option>
                <option value={LogLevel.Warning}>
                  {LogLevel[LogLevel.Warning]}
                </option>
                <option value={LogLevel.Error}>
                  {LogLevel[LogLevel.Error]}
                </option>
              </select>
            </div>

            <button
              className="btn-md btn-danger"
              onClick={handleDeleteAll}
              disabled={!selectedIds || selectedIds.length === 0}
            >
              <FaTrash /> Delete Selected ({selectedIds.length || 0})
            </button>
          </div>
        </div>

        <CustomTable headers={headers} data={data} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <LogDataModal
        show={showLogModal}
        onHide={() => setShowLogModal(false)}
        title={modalTitle}
        data={modalData}
      />

      <LoadingScreen isLoading={isLoading || isDeleting} />
    </div>
  );
};

export default Logs;
