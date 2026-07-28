import { useState } from "react";
import { FaArrowLeft, FaClipboardList, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { showSuccess } from "../../../utils";
import CompletedCard from "./CompletedCard/CompletedCard";
import DetailModal from "./DetailModal/DetailModal";
import EditModal from "./EditModal/EditModal";
import NotifyModal from "./NotifyModal/NotifyModal";
import PaymentModal from "./PaymentModal/PaymentModal";
import type { ActiveViewFilter, BoardView, Repair } from "./PickUp.type";
import { INITIAL_REPAIRS, formatCurrency, matchesSearch, todayIso } from "./PickUp.utils";
import RepairCard from "./RepairCard/RepairCard";
import "./pickUp.scss";

const PickUp = () => {
  const [repairs, setRepairs] = useState<Repair[]>(INITIAL_REPAIRS);
  const [view, setView] = useState<BoardView>("active");
  const [filter, setFilter] = useState<ActiveViewFilter>("all");
  const [search, setSearch] = useState("");

  const [readyingId, setReadyingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [payId, setPayId] = useState<string | null>(null);

  const activeRepairs = repairs.filter(
    (r) => r.status === "progress" || r.status === "done",
  );
  const completedRepairs = repairs.filter(
    (r) => r.status === "completed" || r.status === "cancelled",
  );

  const filteredActive = activeRepairs.filter((r) => matchesSearch(r, search));
  const progressRepairs = filteredActive.filter((r) => r.status === "progress");
  let doneRepairs = filteredActive.filter((r) => r.status === "done");
  if (filter === "awaiting") doneRepairs = doneRepairs.filter((r) => !r.notified);
  const awaitingRepairs = filteredActive.filter(
    (r) => r.status === "done" && !r.notified,
  );
  const unpaidTotal = filteredActive
    .filter((r) => !r.paid)
    .reduce((sum, r) => sum + r.cost, 0);

  const filteredCompleted = completedRepairs.filter((r) => matchesSearch(r, search));

  const showProgressCol = filter === "all" || filter === "progress";
  const showDoneCol = filter === "all" || filter === "done" || filter === "awaiting";
  const visibleCols = (showProgressCol ? 1 : 0) + (showDoneCol ? 1 : 0);

  const updateRepair = (id: string, changes: Partial<Repair>) => {
    setRepairs((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  };

  const handleSetView = (next: BoardView) => {
    setView(next);
    setSearch("");
  };

  const handleFinishReady = (didNotify: boolean) => {
    if (!readyingId) return;
    const repair = repairs.find((r) => r.id === readyingId);
    if (!repair) return;
    updateRepair(readyingId, {
      status: "done",
      notified: didNotify,
      notifiedDate: didNotify ? todayIso() : repair.notifiedDate,
    });
    showSuccess(
      `${repair.repairCode} — ${repair.customerName}${
        didNotify ? " done & customer notified" : " done — call customer when possible"
      }`,
    );
    setReadyingId(null);
  };

  const handleNotify = (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    updateRepair(id, { notified: true, notifiedDate: todayIso() });
    showSuccess(`${repair.repairCode} — ${repair.customerName} notified`);
  };

  const handlePickedUp = (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    if (!repair.paid) {
      setPayId(id);
      return;
    }
    updateRepair(id, { status: "completed", pickedUpDate: todayIso(), slotNumber: null });
    showSuccess(`${repair.repairCode} — ${repair.customerName} picked up`);
  };

  const handleConfirmPayment = (id: string, payMethod: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    updateRepair(id, {
      paid: true,
      payMethod,
      status: "completed",
      pickedUpDate: todayIso(),
      slotNumber: null,
    });
    showSuccess(`${repair.repairCode} — ${repair.customerName} paid (${payMethod}) and picked up`);
    setPayId(null);
  };

  const handleSaveEdit = (
    id: string,
    changes: { notes: string; cost: number; dueDate: string; paid: boolean },
  ) => {
    const current = repairs.find((r) => r.id === id);
    if (!current) return;
    updateRepair(id, {
      notes: changes.notes,
      cost: changes.cost,
      dueDate: changes.dueDate,
      paid: changes.paid,
      payMethod: changes.paid ? current.payMethod : "",
    });
    showSuccess(`${current.repairCode} updated`);
    setEditId(null);
  };

  const handleCancelRepair = (id: string) => {
    const repair = repairs.find((r) => r.id === id);
    if (!repair) return;
    if (
      !window.confirm(`Cancel repair ${repair.repairCode}? This will move it to completed.`)
    )
      return;
    updateRepair(id, { status: "cancelled", cancelledDate: todayIso(), slotNumber: null });
    showSuccess(`${repair.repairCode} — ${repair.customerName} cancelled`);
    setEditId(null);
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
            {view === "active"
              ? `${filteredActive.length} active repair${filteredActive.length !== 1 ? "s" : ""}`
              : `${filteredCompleted.length} completed repair${filteredCompleted.length !== 1 ? "s" : ""}`}
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
                {filteredActive.filter((r) => r.status === "done").length}
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
          {filteredCompleted.length ? (
            filteredCompleted.map((r) => <CompletedCard key={r.id} repair={r} />)
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
