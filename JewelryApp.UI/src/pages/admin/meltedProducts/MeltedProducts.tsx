import { useState } from "react";
import {
  FaFire,
  FaList,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import {
  getMeltedProducts,
  getMeltedReports,
} from "../../../apis/products.api/products.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../types/enums";
import { handleSort, renderLongDescription } from "../../../utils";
import "./meltedProducts.scss";

interface MeltedProduct {
  id: string;
  sku: string;
  productName?: string;
  quantity: number;
  weight?: number;
  karatType?: number | string;
  meltedAt?: string;
}

const MeltedProducts = () => {
  const [appliedDateRange, setAppliedDateRange] = useState<{
    dateFrom: string | null;
    dateTo: string | null;
  }>({ dateFrom: null, dateTo: null });

  const [dateRange, setDateRange] = useState<{
    dateFrom: string | null;
    dateTo: string | null;
  }>({ dateFrom: null, dateTo: null });

  const { data: meltedReports } = useLocalApi({
    apiToCall: (data) => getMeltedReports(data.payload),
    payload: {
      dateFrom: appliedDateRange.dateFrom,
      dateTo: appliedDateRange.dateTo,
    },
    effectDependency: [appliedDateRange],
  }) as { data: { melted?: any[]; Melted?: any[] } };

  const rawMeltedRows: any[] =
    meltedReports?.melted ?? meltedReports?.Melted ?? [];

  const meltedRows = [18, 21, 22, 24].map((karat) => {
    const found = rawMeltedRows.find(
      (r) => r.karatType === karat || r.KaratType === karat,
    );
    return {
      karatType: karat,
      itemCount: found?.itemCount ?? found?.ItemCount ?? 0,
      totalWeight: found?.totalWeight ?? found?.TotalWeight ?? 0,
    };
  });

  const handleApply = () =>
    setAppliedDateRange({
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo ? `${dateRange.dateTo}T23:59:59` : null,
    });
  const handleAllTime = () => {
    setDateRange({ dateFrom: null, dateTo: null });
    setAppliedDateRange({ dateFrom: null, dateTo: null });
  };

  const {
    data: products,
    isLoading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onSortChange,
    onSearchChange,
    sortCriteria,
  } = useLocalApiSearchSortPagination<MeltedProduct>({
    apiToCall: (data) => getMeltedProducts(data.payload),
    initialSortBy: "MeltedAt",
    initialSortDirection: SortDirection.Descending,
  });

  const headers = [
    {
      key: "sku",
      label: "SKU",
      width: "150px",
      onHeaderClick: () => handleSort("Sku", sortCriteria, onSortChange),
    },
    {
      key: "productName",
      label: "Product Name",
      width: "200px",
      onHeaderClick: () =>
        handleSort("ProductName", sortCriteria, onSortChange),
    },
    {
      key: "quantity",
      label: "Quantity",
      width: "100px",
      onHeaderClick: () => handleSort("Quantity", sortCriteria, onSortChange),
    },
    {
      key: "weight",
      label: "Weight (g)",
      width: "120px",
      onHeaderClick: () => handleSort("Weight", sortCriteria, onSortChange),
    },
    {
      key: "karat",
      label: "Karat",
      width: "100px",
      onHeaderClick: () => handleSort("KaratType", sortCriteria, onSortChange),
    },
    {
      key: "meltedAt",
      label: "Melted At",
      width: "200px",
      onHeaderClick: () => handleSort("MeltedAt", sortCriteria, onSortChange),
    },
  ];

  const data = products?.map((p) => ({
    meltedAt: p.meltedAt ? new Date(p.meltedAt).toLocaleString() : "",
    sku: p.sku,
    productName: renderLongDescription(p.productName, 30),
    quantity: p.quantity,
    weight: p.weight ?? "",
    karat: p.karatType ? `${p.karatType}K` : "",
  }));

  return (
    <div id="melted-products" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaFire className="icon" />
          <span>Melted products</span>
        </h1>

        <div className="page-actions">
          <div className="date-filters">
            <input
              type="date"
              value={dateRange.dateFrom ?? ""}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  dateFrom: e.target.value || null,
                }))
              }
            />
            <input
              type="date"
              value={dateRange.dateTo ?? ""}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  dateTo: e.target.value || null,
                }))
              }
            />
            <button
              className="btn-md btn-gold"
              onClick={handleApply}
              disabled={!dateRange.dateFrom || !dateRange.dateTo}
            >
              Apply
            </button>
            <button
              className="btn-md btn-outline"
              onClick={handleAllTime}
              disabled={
                appliedDateRange.dateFrom == null &&
                appliedDateRange.dateTo == null
              }
            >
              All time
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <FaFire className="icon" /> Items melted
        </div>
        <div className="melt-summary-grid">
          {meltedRows.map((r) => (
            <div key={r.karatType} className="melt-card">
              <span className="melt-karat">{r.karatType}K Gold</span>
              <div className="melt-count">{r.itemCount} items</div>
              <div className="melt-weight">{r.totalWeight.toFixed(2)} g</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            <FaList className="icon" /> Melted records
          </span>
          <div className="tbl-tools">
            <div className="search-wrap">
              <FaSearch className="search-ico" />
              <input
                type="text"
                className="search-input"
                placeholder="Search melted records..."
                onChange={onSearchChange}
              />
            </div>
            <button
              className="btn-md btn-outline"
              title={`Sort by Date ${
                sortCriteria.sortDirection === "Ascending"
                  ? "Descending"
                  : "Ascending"
              }`}
              onClick={() => handleSort("MeltedAt", sortCriteria, onSortChange)}
            >
              {sortCriteria.sortDirection === "Ascending" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
              Date
            </button>
          </div>
        </div>
        <CustomTable data={data} headers={headers} isLoading={isLoading} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default MeltedProducts;
