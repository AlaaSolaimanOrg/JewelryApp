import { useEffect, useState } from "react";
import { FaArrowLeft, FaClipboardList, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getRepairs,
  updateRepair,
  updateRepairPaymentStatus,
  updateRepairStatus,
} from "../../../apis/repairs.api/repairs.api";
import { PaymentStatus, RepairStatus } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import CompletedCard from "./CompletedCard/CompletedCard";
import DetailModal from "./DetailModal/DetailModal";
import EditModal from "./EditModal/EditModal";
import NotifyModal from "./NotifyModal/NotifyModal";
import PaymentModal from "./PaymentModal/PaymentModal";
import type { ActiveViewFilter, BoardView, Repair } from "./PickUp.type";
import { formatCurrency, mapRepairDtoToRepair } from "./PickUp.utils";
import RepairCard from "./RepairCard/RepairCard";
import "./pickUp.scss";

const ACTIVE_STATUSES = [RepairStatus.InProgress, RepairStatus.Completed];
const COMPLETED_STATUSES = [RepairStatus.PickedUp, RepairStatus.Cancelled];

const PickUp = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<BoardView>("active");
  const [filter, setFilter] = useState<ActiveViewFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [readyingId, setReadyingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [payId, setPayId] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const response = await getRepairs({
        statuses: view === "active" ? ACTIVE_STATUSES : COMPLETED_STATUSES,
        searchBy: debouncedSearch || undefined,
        pageNumber: 1,
        pageSize: 300,
      });
      if (checkRequestSucceeded(response?.statusCode)) {
        setRepairs((response?.data || []).map(mapRepairDtoToRepair));
      } else if (response?.statusCode !== 204) {
        showError(response?.message || "Failed to load repairs");
      } else {
        setRepairs([]);
      }
    } catch {
      showError("Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [view, debouncedSearch]);

  const progressRepairs = repairs.filter((r) => r.status === "progress");
  let doneRepairs = repairs.filter((r) => r.status === "done");
  if (filter === "awaiting") doneRepairs = doneRepairs.filter((r) => !r.notified);
  const awaitingRepairs = repairs.filter((r) => r.status === "done" && !r.notified);
  const unpaidTotal = repairs.filter((r) => !r.paid).reduce((sum, r) => sum + r.cost, 0);

  const showProgressCol = filter === "all" || filter === "progress";
  const showDoneCol = filter === "all" || filter === "done" || filter === "awaiting";
  const visibleCols = (showProgressCol ? 1 : 0) + (showDoneCol ? 1 : 0);

  const handleSetView = (next: BoardView) => {
    setView(next);
    setSearch("");
    setDebouncedSearch("");
  };

  const handleFinishReady = async (didNotify: boolean) => {
    if (!readyingId) return;
    const repair = repairs.find((r) => r.id === readyingId);
    if (!repair) return;

    const response = await updateRepairStatus({
      id: readyingId,
      status: RepairStatus.Completed,
      sendSms: didNotify,
    });

    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(
        response?.message ||
          `${repair.repairCode} — ${repair.customerName}${
            didNotify ? " done & customer notified" : " done — call customer when possible"
          }`,
      );
      await fetchRepairs();
    } else {
      showError(response?.message || "Failed to update repair");
    }
    setReadyingId(null);
  };

  const handleNotify = async (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;

    const response = await updateRepairStatus({
      id,
      status: RepairStatus.Completed,
      sendSms: true,
    });

    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(response?.message || `${repair.repairCode} — ${repair.customerName} notified`);
      await fetchRepairs();
    } else {
      showError(response?.message || "Failed to notify customer");
    }
  };

  const handlePickedUp = async (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    if (!repair.paid) {
      setPayId(id);
      return;
    }

    const response = await updateRepairStatus({ id, status: RepairStatus.PickedUp });
    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(response?.message || `${repair.repairCode} — ${repair.customerName} picked up`);
      await fetchRepairs();
    } else {
      showError(response?.message || "Failed to mark as picked up");
    }
  };

  const handleConfirmPayment = async (id: string, payMethod: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;

    const response = await updateRepairStatus({
      id,
      status: RepairStatus.PickedUp,
      payMethod,
    });

    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(
        response?.message ||
          `${repair.repairCode} — ${repair.customerName} paid (${payMethod}) and picked up`,
      );
      setPayId(null);
      await fetchRepairs();
    } else {
      showError(response?.message || "Failed to record payment");
    }
  };

  const handleSaveEdit = async (
    id: string,
    changes: { notes: string; cost: number; dueDate: string; paid: boolean },
  ) => {
    const current = repairs.find((r) => r.id === id);
    if (!current) return;

    const response = await updateRepair({
      id,
      cost: changes.cost,
      notes: changes.notes,
      dueDate: changes.dueDate || null,
    });

    if (!checkRequestSucceeded(response?.statusCode)) {
      showError(response?.message || "Failed to update repair");
      return;
    }

    if (changes.paid !== current.paid) {
      const payResponse = await updateRepairPaymentStatus({
        id,
        newPaymentStatus: changes.paid ? PaymentStatus.Paid : PaymentStatus.Unpaid,
      });
      if (!checkRequestSucceeded(payResponse?.statusCode)) {
        showError(payResponse?.message || "Failed to update payment status");
        return;
      }
    }

    showSuccess(`${current.repairCode} updated`);
    setEditId(null);
    await fetchRepairs();
  };

  const handleCancelRepair = async (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    if (
      !window.confirm(`Cancel repair ${repair.repairCode}? This will move it to completed.`)
    )
      return;

    const response = await updateRepairStatus({ id, status: RepairStatus.Cancelled });
    if (checkRequestSucceeded(response?.statusCode)) {
      showSuccess(response?.message || `${repair.repairCode} — ${repair.customerName} cancelled`);
      setEditId(null);
      await fetchRepairs();
    } else {
      showError(response?.message || "Failed to cancel repair");
    }
  };

  const readyingRepair = repairs.find((r) => r.id === readyingId) || null;
  const detailRepair = repairs.find((r) => r.id === detailId) || null;
  const editRepair = repairs.find((r) => r.id === editId) || null;
  const payRepair = repairs.find((r) => r.id === payId) || null;

  return (
    <div className="pickup-page">
      <div className="pu-top-bar">
        <span className="pu-top-title">
          <FaClipboardList /> Repair orders
        </span>
        <div className="pu-top-right">
          <span className="pu-header-count">
            {loading
              ? "Loading..."
              : view === "active"
                ? `${repairs.length} active repair${repairs.length !== 1 ? "s" : ""}`
                : `${repairs.length} completed repair${repairs.length !== 1 ? "s" : ""}`}
          </span>
          <Link to="/" className="pu-btn pu-btn-outline">
            <FaArrowLeft /> Back to POS
          </Link>
        </div>
      </div>

      <div className="pu-controls">
        <div className="pu-search-wrap">
          <FaSearch className="pu-search-ico" />
          <input
            type="text"
            className="pu-search-input"
            placeholder="Search by name, phone, or repair code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        {view === "active" && (
          <select
            className="pu-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActiveViewFilter)}
          >
            <option value="all">All active</option>
            <option value="progress">In progress</option>
            <option value="done">Done</option>
            <option value="awaiting">Awaiting call</option>
          </select>
        )}
        <button
          className={`pu-tab-btn ${view === "active" ? "active" : ""}`}
          onClick={() => handleSetView("active")}
        >
          Active
        </button>
        <button
          className={`pu-tab-btn ${view === "completed" ? "active" : ""}`}
          onClick={() => handleSetView("completed")}
        >
          Completed
        </button>
      </div>

      {view === "active" && (
        <>
          <div className="pu-stats">
            <div className="pu-stat">
              <div className="pu-stat-num" style={{ color: "var(--pos-amber)" }}>
                {progressRepairs.length}
              </div>
              <div className="pu-stat-label">In progress</div>
            </div>
            <div className="pu-stat">
              <div className="pu-stat-num" style={{ color: "var(--pos-green)" }}>
                {repairs.filter((r) => r.status === "done").length}
              </div>
              <div className="pu-stat-label">Done</div>
            </div>
            <div className="pu-stat">
              <div
                className="pu-stat-num"
                style={{
                  color: awaitingRepairs.length ? "var(--pos-amber)" : "var(--pos-text-muted)",
                }}
              >
                {awaitingRepairs.length}
              </div>
              <div className="pu-stat-label">Awaiting call</div>
            </div>
            <div className="pu-stat">
              <div className="pu-stat-num" style={{ color: "var(--pos-red)" }}>
                {formatCurrency(unpaidTotal)}
              </div>
              <div className="pu-stat-label">Unpaid</div>
            </div>
          </div>

          <div className={`pu-board pu-cols-${visibleCols}`}>
            {showProgressCol && (
              <div className="pu-col pu-col-progress">
                <div className="pu-col-border" />
                <div className="pu-col-head">
                  <span>
                    <span className="pu-col-dot" style={{ background: "var(--pos-amber)" }} />
                    In progress
                  </span>
                  <span>{progressRepairs.length}</span>
                </div>
                {progressRepairs.length ? (
                  progressRepairs.map((r) => (
                    <RepairCard
                      key={r.id}
                      repair={r}
                      onMarkReady={setReadyingId}
                      onOpenDetail={setDetailId}
                      onOpenEdit={setEditId}
                      onNotify={handleNotify}
                      onPickedUp={handlePickedUp}
                    />
                  ))
                ) : (
                  <div className="pu-empty-col">No repairs in progress</div>
                )}
              </div>
            )}
            {showDoneCol && (
              <div className="pu-col pu-col-done">
                <div className="pu-col-border" />
                <div className="pu-col-head">
                  <span>
                    <span className="pu-col-dot" style={{ background: "var(--pos-green)" }} />
                    Done
                  </span>
                  <span>{doneRepairs.length}</span>
                </div>
                {doneRepairs.length ? (
                  doneRepairs.map((r) => (
                    <RepairCard
                      key={r.id}
                      repair={r}
                      onMarkReady={setReadyingId}
                      onOpenDetail={setDetailId}
                      onOpenEdit={setEditId}
                      onNotify={handleNotify}
                      onPickedUp={handlePickedUp}
                    />
                  ))
                ) : (
                  <div className="pu-empty-col">No finished repairs waiting</div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {view === "completed" && (
        <div className="pu-completed-section">
          {repairs.length ? (
            repairs.map((r) => <CompletedCard key={r.id} repair={r} />)
          ) : (
            <div className="pu-empty-col pu-empty-completed">No completed repairs found</div>
          )}
        </div>
      )}

      <NotifyModal
        repair={readyingRepair}
        onClose={() => setReadyingId(null)}
        onConfirm={handleFinishReady}
      />
      <DetailModal repair={detailRepair} onClose={() => setDetailId(null)} />
      <EditModal
        repair={editRepair}
        onClose={() => setEditId(null)}
        onSave={handleSaveEdit}
        onCancelRepair={handleCancelRepair}
      />
      <PaymentModal
        repair={payRepair}
        onClose={() => setPayId(null)}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
};

export default PickUp;
