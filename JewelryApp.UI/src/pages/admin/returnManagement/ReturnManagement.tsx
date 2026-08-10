import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { FaCheck, FaPrint, FaSearch, FaSortAmountDown, FaSortAmountUp, FaUndo } from "react-icons/fa";
import "./returnManagement.scss";

import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  ItemCondition,
  KaratType,
  ReturnItemsView,
  ReturnOption,
  ReturnReason,
  SortDirection,
} from "../../../types/enums";

import {
  getReturnItems,
  getReturnItemsCounts,
  markReturnItemsPrinted,
} from "../../../apis/returns.api/returns.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomLoader from "../../../components/loaders/CustomLoader/CustomLoader";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";

export interface ReturnItemFlat {
  id: string;
  productName: string;
  sku?: string;
  karat: KaratType;
  weight: number;
  quantityReturned: number;
  amountReturned: number;
  productImage?: string;
  reason: ReturnReason;
  reasonNote?: string;
  condition: ItemCondition;
  option: ReturnOption;
  customerName: string;
  customerPhone?: string;
  saleSerialNumber: string;
  returnDate: string;
  isTagPrinted: boolean;
  tagPrintedDate?: string;
}

const VIEW_TABS: { value: ReturnItemsView; label: string }[] = [
  { value: ReturnItemsView.NeedsTags, label: "Needs tags" },
  { value: ReturnItemsView.Printed, label: "Printed" },
  { value: ReturnItemsView.All, label: "All returns" },
];

const REASON_LABELS: Record<ReturnReason, string> = {
  [ReturnReason.NotAsExpected]: "Not as expected",
  [ReturnReason.WrongSize]: "Wrong size",
  [ReturnReason.Defective]: "Defective",
  [ReturnReason.GiftReturn]: "Gift return",
  [ReturnReason.Other]: "Other",
};

const CONDITION_LABELS: Record<ItemCondition, string> = {
  [ItemCondition.Good]: "Good",
  [ItemCondition.NeedsPolishing]: "Needs polish",
  [ItemCondition.Damaged]: "Damaged",
};

const canSelectItem = (item: ReturnItemFlat) =>
  !item.isTagPrinted && item.option === ReturnOption.ReturnToStock;

const formatCurrency = (value: number) => `$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const formatDayLabel = (dateString: string) => {
  const d = new Date(dateString);
  const today = new Date();
  const dayStart = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((dayStart(today) - dayStart(d)) / 864e5);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const dayKey = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const ReturnManagement: React.FC = () => {
  const [view, setView] = useState<ReturnItemsView>(ReturnItemsView.NeedsTags);
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState({ needsTags: 0, printed: 0, all: 0 });
  const [isPrinting, setIsPrinting] = useState(false);

  const {
    data: items,
    isLoading,
    onSearchChange,
    pagination,
    onPaginationChange,
    fetchData,
  } = useLocalApiSearchSortPagination<ReturnItemFlat>({
    apiToCall: (data) =>
      getReturnItems({
        searchBy: data.payload.searchBy,
        view,
        pageNumber: data.payload.pageNumber,
        pageSize: data.payload.pageSize,
        sortBy: "CreatedDate",
        sortDirection: sortDesc ? SortDirection.Descending : SortDirection.Ascending,
      }),
    extraEffectDependency: [view, sortDesc],
    initialPageSize: 20,
  });

  const refreshCounts = async () => {
    const response = await getReturnItemsCounts();
    if (checkRequestSucceeded(response.statusCode) && response.data) {
      setCounts(response.data);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  useEffect(() => {
    setSelected({});
  }, [view]);

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const toggleSelect = (item: ReturnItemFlat) => {
    if (!canSelectItem(item)) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[item.id]) delete next[item.id];
      else next[item.id] = true;
      return next;
    });
  };

  const selectDay = (dayItems: ReturnItemFlat[]) => {
    setSelected((prev) => {
      const next = { ...prev };
      dayItems.forEach((item) => {
        if (canSelectItem(item)) next[item.id] = true;
      });
      return next;
    });
  };

  const clearSelection = () => setSelected({});

  const printTags = async (ids: string[]) => {
    if (!ids.length) return;
    setIsPrinting(true);
    try {
      const response = await markReturnItemsPrinted({ returnItemIds: ids });
      if (checkRequestSucceeded(response.statusCode)) {
        showSuccess(`Sent ${ids.length} tag${ids.length !== 1 ? "s" : ""} to printer`);
        setSelected((prev) => {
          const next = { ...prev };
          ids.forEach((id) => delete next[id]);
          return next;
        });
        fetchData();
        refreshCounts();
      } else {
        showError(response?.message);
      }
    } finally {
      setIsPrinting(false);
    }
  };

  // group current page's items by day, preserving the backend's sort order
  const groups: { key: string; label: string; items: ReturnItemFlat[] }[] = [];
  (items ?? []).forEach((item) => {
    const key = dayKey(item.returnDate);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: formatDayLabel(item.returnDate), items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });

  const renderBadges = (item: ReturnItemFlat) => (
    <>
      {item.isTagPrinted ? (
        <Badge bg="" className="rm-badge rm-badge-printed">
          <FaPrint /> TAG PRINTED
        </Badge>
      ) : item.option === ReturnOption.ReturnToStock ? (
        <Badge bg="" className="rm-badge rm-badge-needs">
          NEEDS TAG
        </Badge>
      ) : null}
      {item.option === ReturnOption.MeltAfterReturn && (
        <Badge bg="" className="rm-badge rm-badge-melt">
          MELT
        </Badge>
      )}
      <Badge bg="" className="rm-badge rm-badge-cond">
        {CONDITION_LABELS[item.condition]}
      </Badge>
    </>
  );

  return (
    <div id="return-management" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUndo className="icon" />
          <span>Returned items — tag printing</span>
        </h1>
      </div>

      <div className="rm-controls">
        <div className="rm-view-tabs">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`rm-view-tab ${view === tab.value ? "active" : ""}`}
              onClick={() => setView(tab.value)}
            >
              {tab.label}
              <span className="rm-vt-count">
                {tab.value === ReturnItemsView.NeedsTags
                  ? counts.needsTags
                  : tab.value === ReturnItemsView.Printed
                    ? counts.printed
                    : counts.all}
              </span>
            </button>
          ))}
        </div>

        <div className="rm-search-wrap">
          <FaSearch className="rm-search-ico" />
          <input
            type="text"
            className="rm-search-input"
            placeholder="Search item, SKU, customer, receipt..."
            onChange={onSearchChange}
          />
        </div>

        <button type="button" className="rm-sort-btn" onClick={() => setSortDesc((s) => !s)}>
          {sortDesc ? <FaSortAmountDown /> : <FaSortAmountUp />}
          {sortDesc ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="rm-print-bar">
          <span className="rm-print-bar-info">
            {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""} selected for tag printing
          </span>
          <div className="rm-print-bar-actions">
            <button
              type="button"
              className="btn-md btn-gold"
              disabled={isPrinting}
              onClick={() => printTags(selectedIds)}
            >
              <FaPrint /> Print {selectedIds.length} tag{selectedIds.length !== 1 ? "s" : ""}
            </button>
            <button type="button" className="btn-md btn-gray" onClick={clearSelection}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="rm-list">
        {isLoading ? (
          <div className="rm-loader">
            <CustomLoader />
          </div>
        ) : !items || items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <h3>{view === ReturnItemsView.NeedsTags ? "No items waiting for tags" : "No items found"}</h3>
            <p>
              {view === ReturnItemsView.NeedsTags
                ? "All returned items have their tags printed."
                : "No returns match your search."}
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const selectableInDay = group.items.filter(canSelectItem);
            return (
              <div className="rm-date-group" key={group.key}>
                <div className="rm-date-head">
                  <span className="rm-date-title">{group.label}</span>
                  <span className="rm-date-count">
                    {group.items.length} item{group.items.length !== 1 ? "s" : ""}
                  </span>
                  <div className="rm-date-line" />
                  {selectableInDay.length > 0 && (
                    <button
                      type="button"
                      className="rm-date-selectall"
                      onClick={() => selectDay(group.items)}
                    >
                      Select all ({selectableInDay.length})
                    </button>
                  )}
                </div>

                {group.items.map((item) => {
                  const canSelect = canSelectItem(item);
                  const isChecked = !!selected[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`rm-item-row ${isChecked ? "checked" : ""} ${item.isTagPrinted ? "printed" : ""}`}
                    >
                      <div
                        className={`rm-item-cb ${!canSelect ? "disabled" : ""}`}
                        onClick={() => toggleSelect(item)}
                      >
                        {isChecked && <FaCheck />}
                      </div>

                      <div className="rm-item-main" onClick={() => toggleSelect(item)}>
                        <div className="rm-item-name">
                          {item.productName}
                          {item.quantityReturned > 1 ? ` (×${item.quantityReturned})` : ""}
                          {renderBadges(item)}
                        </div>
                        <div className="rm-item-meta">
                          {item.karat}K · {item.weight}g ·{" "}
                          <span className="rm-mono">{item.sku}</span> ·{" "}
                          {REASON_LABELS[item.reason]}
                        </div>
                        <div className="rm-item-cust">
                          {item.customerName} · {item.saleSerialNumber}
                        </div>
                      </div>

                      <div className="rm-item-right">
                        <div className="rm-item-amt">{formatCurrency(item.amountReturned)}</div>
                        <div className="rm-item-time">{formatTime(item.returnDate)}</div>
                        {item.isTagPrinted && item.tagPrintedDate && (
                          <div className="rm-item-time">Printed {formatDayLabel(item.tagPrintedDate)}</div>
                        )}
                        {item.option === ReturnOption.ReturnToStock && (
                          <button
                            type="button"
                            className="rm-item-print-one"
                            disabled={isPrinting}
                            onClick={(e) => {
                              e.stopPropagation();
                              printTags([item.id]);
                            }}
                          >
                            <FaPrint /> {item.isTagPrinted ? "Reprint" : "Print"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};

export default ReturnManagement;
